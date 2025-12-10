import request from "supertest";
import { jest } from "@jest/globals";

// ================================
// MOCKS NECESARIOS
// ================================

// Mock global fetch
global.fetch = jest.fn();

// Mock de la búsqueda de fragmentos
jest.mock("../scripts/test_busqueda.js", () => ({
    buscarFragmentosSimilares: jest.fn().mockResolvedValue([
        { id: 1, contenido: "fragmento simulado", score: 0.99 }
    ])
}));

// IMPORTA LA API COMPLETA (esto inicia el servidor automáticamente)
import "../server.js";

const baseURL = "http://0.0.0.0:3000";

// Delay para evitar condiciones de carrera cuando el server arranca
const wait = (ms) => new Promise(res => setTimeout(res, ms));

beforeAll(async () => {
    await wait(200); // esperar a que el servidor arranque
});

describe("API Chatbot + Ollama", () => {

    beforeEach(() => {
        fetch.mockReset();
    });

    // ================================
    // GET /
    // ================================
    test("GET / devuelve la info basica de la API", async () => {
        const res = await request(baseURL).get("/");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "API chatBot");
        expect(res.body).toHaveProperty("version");
    });

    // ================================
    // GET /tags
    // ================================
    test("GET /tags lista los modelos", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                models: [{ name: "mistral" }]
            })
        });

        const res = await request(baseURL).get("/tags");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.modelos.length).toBeGreaterThan(0);
    });

    // ================================
    // GET /health
    // ================================
    test("GET /health cuando Ollama responde correctamente", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({})
        });

        const res = await request(baseURL).get("/health");

        expect(res.status).toBe(200);
        expect(res.body.api).toBe("OK");
        expect(res.body.ollama).toBe("OK");
    });

    // ================================
    // GET /info/:modelo
    // ================================
    test("GET /info/mistral devuelve info", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ parameters: {}, license: "MIT" })
        });

        const res = await request(baseURL).get("/info/mistral");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ================================
    // POST /generar
    // ================================
    test("POST /generar devuelve texto generado", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                response: "hola mundo generado"
            })
        });

        const res = await request(baseURL)
            .post("/generar")
            .send({ prompt: "hola" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.respuesta).toBe("hola mundo generado");
    });

    // ================================
    // POST /embeddings
    // ================================
    test("POST /embeddings devuelve un embedding", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                embedding: [0.123, 0.456, 0.789]
            })
        });

        const res = await request(baseURL)
            .post("/embeddings")
            .send({ texto: "hola embedding" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.embedding)).toBe(true);
    });

    // ================================
    // POST /consultar
    // ================================
    test("POST /consultar devuelve fragmentos y respuesta IA", async () => {

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                response: "respuesta del modelo"
            })
        });

        const res = await request(baseURL)
            .post("/consultar")
            .send({ pregunta: "que dice el rof?" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.fragmentos.length).toBeGreaterThan(0);
        expect(res.body.respuesta).toBe("respuesta del modelo");
    });

});
