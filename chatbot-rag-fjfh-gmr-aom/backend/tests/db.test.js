import { jest } from '@jest/globals';

// Crear mocks antes de importar
const mockExec = jest.fn();
const mockPrepare = jest.fn();
const mockGet = jest.fn();
const mockRun = jest.fn();
const mockTransaction = jest.fn();
const mockClose = jest.fn();

const mockDB = {
  exec: mockExec,
  prepare: mockPrepare,
  close: mockClose,
  transaction: mockTransaction
};

// Mock manual de better-sqlite3
const mockSqlite3 = jest.fn(() => mockDB);

// Mock manual de fs
const mockReadFileSync = jest.fn();
const mockStatSync = jest.fn();
const mockExistsSync = jest.fn();
const mockMkdirSync = jest.fn();

// Reemplazar las importaciones antes de cargar el módulo
await jest.unstable_mockModule('better-sqlite3', () => ({
  default: mockSqlite3
}));

await jest.unstable_mockModule('fs', () => ({
  readFileSync: mockReadFileSync,
  statSync: mockStatSync,
  existsSync: mockExistsSync,
  mkdirSync: mockMkdirSync
}));

// Importar el módulo después de los mocks
const cargarDB = await import('../scripts/cargar_db.js');
const { initializeDB, insertarFragmentosDB, verificarBD } = cargarDB.default;

describe('cargar_db.js - Tests Unitarios', () => {
  
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
    
    // Configurar comportamiento por defecto de prepare
    mockPrepare.mockReturnValue({
      get: mockGet,
      run: mockRun
    });
  });

  describe('initializeDB', () => {
    test('debe crear la base de datos y la tabla fragmentos', () => {
      const db = initializeDB();
      
      // Verificar que se llamó a exec para crear la tabla
      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS fragmentos')
      );
      
      // Verificar que retorna el objeto db
      expect(db).toBeDefined();
      expect(db).toBe(mockDB);
    });

    test('debe crear la tabla con todas las columnas necesarias', () => {
      initializeDB();
      
      const sqlCall = mockExec.mock.calls[0][0];
      
      // Verificar que incluye todas las columnas
      expect(sqlCall).toContain('id INTEGER PRIMARY KEY');
      expect(sqlCall).toContain('contenido TEXT NOT NULL');
      expect(sqlCall).toContain('fuente TEXT');
      expect(sqlCall).toContain('pagina INTEGER');
      expect(sqlCall).toContain('embedding BLOB');
      expect(sqlCall).toContain('version TEXT DEFAULT CURRENT_TIMESTAMP');
    });
  });

  describe('insertarFragmentosDB', () => {
    const mockFragmentos = [
      {
        contenido: 'Fragmento de prueba 1',
        fuente: 'test.pdf',
        pagina: 1
      },
      {
        contenido: 'Fragmento de prueba 2',
        fuente: 'test.pdf',
        pagina: 2
      }
    ];

    const mockEmbeddingsData = [
      {
        contenido: 'Fragmento de prueba 1',
        embedding: [0.1, 0.2, 0.3]
      },
      {
        contenido: 'Fragmento de prueba 2',
        embedding: [0.4, 0.5, 0.6]
      }
    ];

    beforeEach(() => {
      // Mock de readFileSync para embeddings.json
      mockReadFileSync.mockReturnValue(JSON.stringify(mockEmbeddingsData));
      
      // Mock de statSync (necesario porque insertarFragmentosDB lo usa)
      mockStatSync.mockReturnValue({
        size: 1024 * 1024 * 2 // 2 MB
      });
      
      // Mock de checkDuplicate (sin duplicados por defecto)
      mockGet.mockReturnValue(null);
      
      // Mock de transaction
      mockTransaction.mockImplementation((fn) => {
        return (data) => fn(data);
      });
    });

    test('debe leer embeddings.json correctamente', () => {
      insertarFragmentosDB(mockDB, mockFragmentos);
      
      expect(mockReadFileSync).toHaveBeenCalledWith(
        'backend/datos/embeddings.json',
        'utf-8'
      );
    });

    test('debe insertar fragmentos con embeddings en la BD', () => {
      insertarFragmentosDB(mockDB, mockFragmentos);
      
      // Verificar que se preparó el statement de inserción
      expect(mockPrepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO fragmentos')
      );
      
      // Verificar que se llamó a run para cada fragmento
      expect(mockRun).toHaveBeenCalledTimes(2);
    });

    test('debe saltar fragmentos duplicados', () => {
      // Simular que el primer fragmento ya existe
      mockGet.mockReturnValueOnce({ id: 1 }).mockReturnValueOnce(null);
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      insertarFragmentosDB(mockDB, mockFragmentos);
      
      // Solo debe insertar 1 fragmento (el segundo)
      expect(mockRun).toHaveBeenCalledTimes(1);
      
      // Debe mostrar mensaje de duplicado
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Saltado (duplicado)')
      );
      
      consoleSpy.mockRestore();
    });

    test('debe usar transacciones para las inserciones', () => {
      insertarFragmentosDB(mockDB, mockFragmentos);
      
      expect(mockTransaction).toHaveBeenCalledTimes(1);
      expect(mockTransaction).toHaveBeenCalledWith(expect.any(Function));
    });

    test('debe convertir embeddings a Buffer correctamente', () => {
      insertarFragmentosDB(mockDB, mockFragmentos);
      
      // Verificar que se llamó a run con los parámetros correctos
      const firstCall = mockRun.mock.calls[0];
      
      expect(firstCall[0]).toBe('Fragmento de prueba 1');
      expect(firstCall[1]).toBe('test.pdf');
      expect(firstCall[2]).toBe(1);
      expect(firstCall[3]).toBeDefined(); // El embedding serializado
    });
  });

  describe('verificarBD', () => {
    beforeEach(() => {
      // Mock de statSync
      mockStatSync.mockReturnValue({
        size: 1024 * 1024 * 5 // 5 MB
      });
    });

    test('debe contar correctamente los fragmentos', () => {
      mockGet.mockReturnValueOnce({ total: 100 });
      mockGet.mockReturnValueOnce({ 
        id: 1, 
        contenido: 'test', 
        embedding: 'mock_embedding' 
      });
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      verificarBD(mockDB);
      
      // Verificar que se ejecutó la consulta COUNT
      expect(mockPrepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*)')
      );
      
      // Verificar que se mostró el total
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Fragmentos en BD: 100')
      );
      
      consoleSpy.mockRestore();
    });

    test('debe verificar la integridad de los datos', () => {
      mockGet.mockReturnValueOnce({ total: 50 });
      mockGet.mockReturnValueOnce({ 
        id: 1, 
        contenido: 'test', 
        embedding: 'valid_embedding' 
      });
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      verificarBD(mockDB);
      
      // Debe mostrar mensaje de integridad verificada
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Integridad verificada')
      );
      
      consoleSpy.mockRestore();
    });

    test('debe detectar error de integridad si no hay embedding', () => {
      mockGet.mockReturnValueOnce({ total: 50 });
      mockGet.mockReturnValueOnce({ 
        id: 1, 
        contenido: 'test', 
        embedding: null 
      });
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      verificarBD(mockDB);
      
      // Debe mostrar error de integridad
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error en integridad')
      );
      
      consoleErrorSpy.mockRestore();
    });

    test('debe mostrar el tamaño del archivo correctamente', () => {
      mockGet.mockReturnValueOnce({ total: 100 });
      mockGet.mockReturnValueOnce({ 
        id: 1, 
        contenido: 'test', 
        embedding: 'mock' 
      });
      
      mockStatSync.mockReturnValue({
        size: 1024 * 1024 * 3.5 // 3.5 MB
      });
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      verificarBD(mockDB);
      
      // Verificar que se llamó a statSync
      expect(mockStatSync).toHaveBeenCalledWith('datos/rof_vectores.db');
      
      // Debe mostrar el tamaño en MB
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('3.50 MB')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Integración de funciones', () => {
    test('debe crear BD, insertar y verificar en flujo completo', () => {
      // Setup
      const mockFragmentos = [
        {
          contenido: 'Test completo',
          fuente: 'test.pdf',
          pagina: 1
        }
      ];

      const mockEmbeddings = [
        {
          contenido: 'Test completo',
          embedding: [0.1, 0.2, 0.3]
        }
      ];

      mockReadFileSync.mockReturnValue(JSON.stringify(mockEmbeddings));
      mockGet.mockReturnValueOnce(null); // No duplicado
      mockGet.mockReturnValueOnce({ total: 1 }); // Count
      mockGet.mockReturnValueOnce({ 
        id: 1, 
        contenido: 'Test completo', 
        embedding: 'mock' 
      }); // Sample
      
      mockTransaction.mockImplementation((fn) => {
        return (data) => fn(data);
      });

      mockStatSync.mockReturnValue({ size: 1024 * 1024 });

      // Ejecutar flujo completo
      const db = initializeDB();
      insertarFragmentosDB(db, mockFragmentos);
      verificarBD(db);

      // Verificaciones
      expect(mockExec).toHaveBeenCalled(); // Tabla creada
      expect(mockRun).toHaveBeenCalled(); // Fragmento insertado
      expect(mockPrepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*)')
      ); // BD verificada
    });
  });
});