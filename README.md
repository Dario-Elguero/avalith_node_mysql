# avalith_node_mysql

Utilizando una base de datos como MySQL o PostgreSQL crear una API donde se pueda crear, modificar, consultar y eliminar libros de una tabla "books". Esta tabla debera tener un ID, name, isbn, author. Los endpoints que debera tener la API son los siguientes:

```
GET /books : Obtener un listado de todos los libros de la tabla.
GET /books/:id : Obtener la informacion de un libro al particular, por ejemplo "/books/32" obtiene la informacion del libro 32.
POST /books : Crear un nuevo libro a partir de la informacion que envia el usuario.
DELETE /books/:id : Eliminar un libro por 1D
```
Como un adicional, para desarrollar esta API deberan utilizar eslint, donde debera estar correctamente configurado en el proyecto con un archivo .eslintrc . Las reglas queda a discrecion de cada uno, pero en el futuro usaran uno en comun.

Tener en cuenta los siguientes puntos:

NO pueden utilizar un ORM. SOLO pueden usar MySQL o PostgreSQL.

Validar correctamente la informacion enviada por el usuario.

Responder correctamente al usuario tanto en caso de que funcione correctamente la operacion como si falla en algun motivo.

Utilizar correctamente los conceptos de asincronismo.
