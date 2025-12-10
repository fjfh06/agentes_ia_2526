<<<<<<< HEAD
import { jest } from '@jest/globals';

// Crear mocks antes de importar
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
=======
// backend/tests/procesarROF.test.js
import { jest } from "@jest/globals";

// Creamos el mock de fs
const fsMock = {
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
};

// Mock del módulo antes de importar
jest.unstable_mockModule("fs", () => fsMock);

let procesarROF;

// Import dinámico del módulo después del mock
beforeAll(async () => {
  const mod = await import("../scripts/procesar_rof.js");
  procesarROF = mod.procesarROF;
});
>>>>>>> 04157848e344a3f76e97c2224a64d1d82c8211d5

// Mock manual de fs
await jest.unstable_mockModule('fs', () => ({
  default: {
    readFileSync: mockReadFileSync,
    writeFileSync: mockWriteFileSync
  },
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync
}));

// Importar el módulo después de los mocks
const { procesarROF } = await import('../scripts/procesar_rof.js');

describe('procesarROF()', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

<<<<<<< HEAD
  test('debe procesar el archivo y generar chunks correctamente', () => {

    // Simulación del contenido de rof.txt
=======
  test("debe procesar el archivo y generar chunks correctamente", async () => {
>>>>>>> 04157848e344a3f76e97c2224a64d1d82c8211d5
    const contenidoFalso = `
      Este es un parrafo suficientemente largo para pasar los 100 caracteres.
      Tiene informacion irrelevante solo para la prueba.

      Este parrafo es demasiado corto.

      Este es otro parrafo muy largo que supera el limite y debe agruparse correctamente
      dentro de un chunk sin exceder los limites de longitud.
    `;

<<<<<<< HEAD
    mockReadFileSync.mockReturnValue(contenidoFalso);
    mockWriteFileSync.mockImplementation(() => {});

    const resultado = procesarROF();

    // --- VALIDACIONES ---
    expect(mockReadFileSync).toHaveBeenCalled();
    expect(mockWriteFileSync).toHaveBeenCalled();

    // 2 parrafos largos deberían generar chunks
    expect(resultado.length).toBeGreaterThan(0);

    // Cada chunk debe tener estructura correcta
    resultado.forEach(chunk => {
      expect(chunk).toHaveProperty('id');
      expect(chunk).toHaveProperty('contenido');
      expect(chunk).toHaveProperty('fuente', 'rof.txt');
      expect(chunk).toHaveProperty('pagina');
    });
  });

  test('debe descartar parrafos pequeños', () => {
=======
    fsMock.readFileSync.mockReturnValue(contenidoFalso);

    const resultado = procesarROF();

    expect(fsMock.readFileSync).toHaveBeenCalled();
    expect(fsMock.writeFileSync).toHaveBeenCalled();
    expect(resultado.length).toBeGreaterThan(0);
  });

  test("debe descartar parrafos pequeños", async () => {
>>>>>>> 04157848e344a3f76e97c2224a64d1d82c8211d5
    const contenido = `
      corto

      Este es un parrafo largo que pasara el filtro de los 100 caracteres.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer.
    `;

<<<<<<< HEAD
    mockReadFileSync.mockReturnValue(contenido);
    mockWriteFileSync.mockImplementation(() => {});
=======
    fsMock.readFileSync.mockReturnValue(contenido);
>>>>>>> 04157848e344a3f76e97c2224a64d1d82c8211d5

    const chunks = procesarROF();

    expect(chunks.length).toBe(1);
  });

});