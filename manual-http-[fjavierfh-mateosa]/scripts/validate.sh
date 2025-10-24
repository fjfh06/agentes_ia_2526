#!/bin/bash
echo "Iniciando validacion del proyecto..."

# Verificar existencia de archivos usando grep (intento de lectura silenciosa)
[ -f package.json ] || { echo "Falta el archivo: package.json"; exit 1; }
[ -f src/db/db.json ] || { echo "Falta el archivo: src/db/db.json"; exit 1; }
[ -f .gitignore ] || { echo "Falta el archivo: .gitignore"; exit 1; }
[ -f .env.example ] || { echo "Falta el archivo: .env.example"; exit 1; }
[ -f README.md ] || { echo "Falta el archivo: README.md"; exit 1; }
[ -f checklist.md ] || { echo "Falta el archivo: checklist.md"; exit 1; }
[ -f peticiones-crud.http ] || { echo "Falta el archivo: peticiones-crud.http"; exit 1; }

# Verificar existencia de carpetas: listamos y usamos grep para ver si hay salida
ls -A src >/dev/null 2>&1 || { echo "Falta la carpeta: src"; exit 1; }
ls -A images >/dev/null 2>&1 || { echo "Falta la carpeta: images"; exit 1; }
ls -A scripts >/dev/null 2>&1 || { echo "Falta la carpeta: scripts"; exit 1; }

# Verificar archivo específico
[ -f src/crud-curl.js ] || { echo "Falta el archivo: src/crud-curl.js"; exit 1; }

# Verificar que package.json tiene "type": "module"
grep -q '"type":\s*"module"' package.json || { echo "package.json no tiene \"type\": \"module\""; exit 1; }

# Verificar script server:up
grep -q '"server:up":' package.json || { echo "No existe el script \"server:up\" en package.json"; exit 1; }

# Verificar script crud:curl
grep -q '"crud:curl":' package.json || { echo "No existe el script \"crud:curl\" en package.json"; exit 1; }

# Opcional: verificar que las dependencias están instaladas con npm list
# (esto fallará si node_modules no existe o no se ha hecho npm install)
npm list dotenv >/dev/null 2>&1 || { echo "dotenv no esta instalado (falta en node_modules)"; exit 1; }
npm list json-server >/dev/null 2>&1 || { echo "json-server no esta instalado (falta en node_modules)"; exit 1; }

# Verificar al menos 6 archivos .png en images/ con "ThdCli" en el nombre
count=0
for file in images/*.png; do
  # Si no hay .png, el patrón no se expande y file == "images/*.png" (que no es un archivo real)
  if [ -f "$file" ]; then
    basename_file=$(basename "$file")
    echo "$basename_file" | grep -q "ThdCli" && ((count++))
  fi
done

if [ $count -lt 6 ]; then
  echo "Se requieren al menos 6 archivos .png en images/ con 'ThdCli' en el nombre. Solo se encontraron $count."
  exit 1
fi

echo "Validacion exitosa. El proyecto cumple con todos los requisitos."
exit 0