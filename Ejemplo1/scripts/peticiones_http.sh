#!/bin/bash
API_URL="http://localhost:3000/books"

echo "### GET: Listar todos los libros"
curl -s $API_URL | jq .
echo -e "\n"

echo "### POST: Crear un nuevo libro"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "id": "11",
    "title": "Domain-Driven Design",
    "authorId": 11,
    "year": 2003,
    "publisher": "Addison-Wesley",
    "language": "English"
  }' | jq .
echo -e "\n"

echo "### PUT: Actualizar un libro (id=11)"
curl -s -X PUT $API_URL/11 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "11",
    "title": "Domain-Driven Design (Updated)",
    "authorId": 11,
    "year": 2003,
    "publisher": "Addison-Wesley",
    "language": "English"
  }' | jq .
echo -e "\n"

echo "### PATCH: Modificar solo el titulo (id=11)"
curl -s -X PATCH $API_URL/11 \
  -H "Content-Type: application/json" \
  -d '{"title": "DDD by Eric Evans"}' | jq .
echo -e "\n"

echo "### DELETE: Eliminar el libro (id=11)"
curl -s -X DELETE $API_URL/11
echo -e "\n"
