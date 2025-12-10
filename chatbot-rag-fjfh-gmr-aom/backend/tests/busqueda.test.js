// backend/tests/busqueda.test.js
import { jest } from '@jest/globals';

// ⚠️ IMPORTANTE: Los mocks deben estar ANTES de cualquier import
jest.unstable_mockModule("../scripts/generar_embeddings.js", () => ({
    generarEmbedding: jest.fn()
}));

jest.unstable_mockModule("better-sqlite3", () => ({
    default: jest.fn()
}));

// Prevenir que dotenv se ejecute durante los tests
jest.unstable_mockModule("dotenv", () => ({
    default: { config: jest.fn() },
    config: jest.fn()
}));

// Ahora importamos DESPUÉS de mockear
const { calcularSimilitud, buscarFragmentosSimilares } = await import("../scripts/test_busqueda.js");
const { generarEmbedding } = await import("../scripts/generar_embeddings.js");
const Database = (await import("better-sqlite3")).default;

// Silenciar console en los tests
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
    console.log.mockRestore();
    console.error.mockRestore();
});

// === Tests calcularSimilitud ===
describe("calcularSimilitud", () => {
    test("vectores idénticos deben dar similitud 1", () => {
        const v1 = [1, 2, 3];
        const v2 = [1, 2, 3];
        expect(calcularSimilitud(v1, v2)).toBeCloseTo(1, 5);
    });

    test("vectores ortogonales deben dar similitud 0", () => {
        const v1 = [1, 0];
        const v2 = [0, 1];
        expect(calcularSimilitud(v1, v2)).toBeCloseTo(0, 5);
    });

    test("vectores opuestos deben dar similitud -1", () => {
        const v1 = [1, 2, 3];
        const v2 = [-1, -2, -3];
        expect(calcularSimilitud(v1, v2)).toBeCloseTo(-1, 5);
    });

    test("debe manejar vector con norma cero", () => {
        const v1 = [0, 0, 0];
        const v2 = [1, 2, 3];
        expect(calcularSimilitud(v1, v2)).toBe(0);
    });

    test("debe manejar v2 como Buffer (simulando BD)", () => {
        const v1 = [1, 2, 3];
        const v2 = { data: Float32Array.from([1, 2, 3]) };
        expect(calcularSimilitud(v1, v2)).toBeCloseTo(1, 5);
    });
});

// === Tests buscarFragmentosSimilares ===
describe("buscarFragmentosSimilares", () => {
    let mockDbInstance;
    let mockPrepare;
    let mockAll;
    let mockClose;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Crear mocks frescos para cada test
        mockAll = jest.fn();
        mockPrepare = jest.fn().mockReturnValue({ all: mockAll });
        mockClose = jest.fn();
        
        mockDbInstance = {
            prepare: mockPrepare,
            close: mockClose
        };
        
        Database.mockImplementation(() => mockDbInstance);
    });

    test("devuelve fragmentos ordenados por similitud", async () => {
        const consulta = "Prueba de búsqueda";

        // Mock del embedding de la consulta
        generarEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);

        // Mock de los datos de la BD
        mockAll.mockReturnValue([
            { id: 1, contenido: "Fragmento A", embedding: JSON.stringify([0.1, 0.2, 0.3]) },
            { id: 2, contenido: "Fragmento B", embedding: JSON.stringify([0.4, 0.5, 0.6]) },
            { id: 3, contenido: "Fragmento C", embedding: JSON.stringify([0.0, 0.0, 0.0]) }
        ]);

        const salida = await buscarFragmentosSimilares(consulta, 2);

        // Verificaciones
        expect(generarEmbedding).toHaveBeenCalledWith(consulta);
        expect(mockPrepare).toHaveBeenCalledWith("SELECT id, contenido, embedding FROM fragmentos");
        expect(mockAll).toHaveBeenCalled();
        expect(mockClose).toHaveBeenCalled();

        const lineas = salida.trim().split("\n").filter(l => l.trim());
        expect(lineas.length).toBe(2);

        // Verificar que están ordenadas por similitud descendente
        const similitudes = lineas.map(l => {
            const match = l.match(/\[([\d.]+)\]/);
            return match ? parseFloat(match[1]) : 0;
        });

        for (let i = 0; i < similitudes.length - 1; i++) {
            expect(similitudes[i]).toBeGreaterThanOrEqual(similitudes[i + 1]);
        }
    });

    test("usa límite por defecto de 3 si no se especifica", async () => {
        generarEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);

        mockAll.mockReturnValue([
            { id: 1, contenido: "A", embedding: JSON.stringify([0.1, 0.2, 0.3]) },
            { id: 2, contenido: "B", embedding: JSON.stringify([0.2, 0.3, 0.4]) },
            { id: 3, contenido: "C", embedding: JSON.stringify([0.3, 0.4, 0.5]) },
            { id: 4, contenido: "D", embedding: JSON.stringify([0.4, 0.5, 0.6]) },
            { id: 5, contenido: "E", embedding: JSON.stringify([0.5, 0.6, 0.7]) }
        ]);

        const salida = await buscarFragmentosSimilares("test");
        const lineas = salida.trim().split("\n").filter(l => l.trim());

        expect(lineas.length).toBe(3);
    });

    test("formatea correctamente el resultado", async () => {
        generarEmbedding.mockResolvedValue([1, 0, 0]);

        mockAll.mockReturnValue([
            { id: 1, contenido: "Test contenido", embedding: JSON.stringify([1, 0, 0]) }
        ]);

        const salida = await buscarFragmentosSimilares("test", 1);

        // Formato esperado: "1. [0.xxxx] "contenido""
        expect(salida).toMatch(/\d+\.\s\[\d+\.\d{4}\]\s".+"/);
        expect(salida).toContain("Test contenido");
    });

    test("maneja base de datos vacía", async () => {
        generarEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);

        mockAll.mockReturnValue([]);

        const salida = await buscarFragmentosSimilares("test", 3);

        expect(salida).toBe("");
    });

    test("devuelve todos los fragmentos si límite es mayor", async () => {
        generarEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);

        mockAll.mockReturnValue([
            { id: 1, contenido: "A", embedding: JSON.stringify([0.1, 0.2, 0.3]) },
            { id: 2, contenido: "B", embedding: JSON.stringify([0.2, 0.3, 0.4]) }
        ]);

        const salida = await buscarFragmentosSimilares("test", 100);
        const lineas = salida.trim().split("\n").filter(l => l.trim());

        expect(lineas.length).toBe(2);
    });
});