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

describe("procesarROF()", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe procesar el archivo y generar chunks correctamente", async () => {
    const contenidoFalso = `
      Este es un parrafo suficientemente largo para pasar los 100 caracteres.
      Tiene informacion irrelevante solo para la prueba.

      Este parrafo es demasiado corto.

      Este es otro parrafo muy largo que supera el limite y debe agruparse correctamente
      dentro de un chunk sin exceder los limites de longitud.
    `;

    fsMock.readFileSync.mockReturnValue(contenidoFalso);

    const resultado = procesarROF();

    expect(fsMock.readFileSync).toHaveBeenCalled();
    expect(fsMock.writeFileSync).toHaveBeenCalled();
    expect(resultado.length).toBeGreaterThan(0);
  });

  test("debe descartar parrafos pequeños", async () => {
    const contenido = `
      corto

      Este es un parrafo largo que pasara el filtro de los 100 caracteres.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer.
    `;

    fsMock.readFileSync.mockReturnValue(contenido);

    const chunks = procesarROF();

    expect(chunks.length).toBe(1);
  });

});
