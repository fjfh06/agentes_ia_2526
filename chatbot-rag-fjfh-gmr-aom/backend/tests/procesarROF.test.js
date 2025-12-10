import { jest } from '@jest/globals';

// Crear mocks antes de importar
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();

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

  test('debe procesar el archivo y generar chunks correctamente', () => {

    // Simulación del contenido de rof.txt
    const contenidoFalso = `
      Este es un parrafo suficientemente largo para pasar los 100 caracteres. 
      Tiene informacion irrelevante solo para la prueba.

      Este parrafo es demasiado corto.

      Este es otro parrafo muy largo que supera el limite y debe agruparse correctamente
      dentro de un chunk sin exceder los limites de longitud.
    `;

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
    const contenido = `
      corto

      Este es un párrafo largo que pasará el filtro de los 100 caracteres.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer.
    `;

    mockReadFileSync.mockReturnValue(contenido);
    mockWriteFileSync.mockImplementation(() => {});

    const chunks = procesarROF();

    // solo debe quedar 1 chunk (el parrafo largo)
    expect(chunks.length).toBe(1);
  });

});