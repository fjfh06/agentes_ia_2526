import sqlite3 from 'better-sqlite3';
import { readFileSync, statSync, existsSync, mkdirSync } from 'fs';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Función para inicializar la BD
function initializeDB() {
  // Crear BD en datos/rof_vectores.db
  const db = new sqlite3('datos/rof_vectores.db');
  
  // Crear tabla 'fragmentos' con estructura especificada
  db.exec(`
    CREATE TABLE IF NOT EXISTS fragmentos (
      id INTEGER PRIMARY KEY,
      contenido TEXT NOT NULL,
      fuente TEXT,
      pagina INTEGER,
      embedding BLOB,
      version TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✓ Tabla "fragmentos" creada');
  
  return db;
}

// Función para insertar fragmentos en BD
function insertarFragmentosDB(db, fragmentos) {
  // Leer datos/embeddings.json
  const embeddingsData = JSON.parse(
    readFileSync('datos/embeddings.json', 'utf-8')
  );
  
  // Preparar statement para inserción
  const insert = db.prepare(`
    INSERT INTO fragmentos (contenido, fuente, pagina, embedding)
    VALUES (?, ?, ?, ?)
  `);

   // Preparar statement para verificar duplicados
    const checkDuplicate = db.prepare(`
    SELECT id FROM fragmentos WHERE contenido = ?
     `);
  
  // Iniciar transacción para velocidad
  const insertMany = db.transaction((fragments) => {
    for (const fragment of fragments) {
      // 1️⃣ Comprobar si ya existe
      const existe = checkDuplicate.get(fragment.contenido);
      if (existe) {
        console.log(`⏩ Saltado (duplicado): ${fragment.contenido}`);
      }
      // Buscar embedding correspondiente
      const embData = embeddingsData.find(e => e.contenido === fragment.contenido);
      
      if (embData && embData.embedding) {
        // Convertir array de embedding a Buffer (BLOB)
        const embeddingBuffer = Buffer.from(
          new Float32Array(embData.embedding).buffer
        );
        
        insert.run(
          fragment.contenido,
          fragment.fuente || null,
          fragment.pagina || null,
          JSON.stringify(embeddingBuffer)
        );
      }
    }
  });
  
  insertMany(fragmentos);
  
  console.log(`✅ Insertados ${fragmentos.length} fragmentos en BD: 87`);
  console.log(`✅ Tamaño de archivo: ${(statSync('datos/rof_vectores.db').size / (1024 * 1024)).toFixed(2)} MB`);
}

// Función para validar integridad
function verificarBD(db) {
  // Cuenta fragmentos en BD
  const count = db.prepare('SELECT COUNT(*) as total FROM fragmentos').get();
  console.log(`✅ Base de datos cargada exitosamente`);
  console.log(`  Fragmentos en BD: ${count.total}`);
  
  // Muestra tamaño del archivo .db
  const stats = statSync('datos/rof_vectores.db');
  console.log(`  Tamaño de archivo: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  
  // Valida integridad
  const sample = db.prepare('SELECT * FROM fragmentos LIMIT 1').get();
  if (sample && sample.embedding) {
    console.log('✅ Integridad verificada');
  } else {
    console.error('❌ Error en integridad de datos');
  }
}

// Ejecución principal
function main() {
  try {
    console.log('Inicializando base de datos...');
    
    // Crear directorio datos si no existe
    if (!existsSync('datos')) {
      mkdirSync('datos');
    }
    
    // Inicializar BD
    const db = initializeDB();
    
    // Cargar fragmentos desde JSON
    const fragmentos = JSON.parse(
      readFileSync('datos/embeddings.json', 'utf-8')
    );
    
    console.log(`\nInsertando ${fragmentos.length} fragmentos...`);
    
    // Insertar fragmentos
    insertarFragmentosDB(db, fragmentos);
    
    console.log('\nVerificando base de datos...');
    
    // Verificar
    verificarBD(db);
    
    // Cerrar conexión
    db.close();
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Ejecución principal
main();