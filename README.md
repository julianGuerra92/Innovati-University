# Innovati University

Proyecto backend Restful API creado como parte de la prueba técnica en el proceso de selección con la empresa Innovati.
<br>
<strong>Autor: Julián Andrés Rodríguez Guerra</strong>
<strong>Video de explicación del proyecto <link>https://www.youtube.com</link></strong>

## Tecnologías y herramientas utilizadas:

- Node js
- Nest js
- Docker
- PostgresSQL

## Instrucciones para iniciar proyecto en modod de desarrollo:

1. Clonación del proyecto.
2. Intalación de dependencias:

```
npm install
```

3. Clonar el archivo `.env.template` y renombrar a `.env`.
4. Agregar los valores a las variables de entorno correspondientes.
5. Levantar el servicio de base de datos mediante el uso de Docker. Para esto ejecutar el siguiente comando:

```
docker compose up -d
```

6. Inicializar el servicio de backend usando el siguiente comando:

```
npm run start:dev
```
