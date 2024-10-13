# Ejecutar en desarrollo

1. Clonar el repo
2. Ejecutar

```
  npm install
```

3. Tener Nest CLI instalado

```
  npm i -g @nest/cli
```

4. Levantar la base de datos

```
  docker-compose up -d
```

5. Clonar el archivo **.env.template**

6. Recontruir la base de datos con la semilla

```
  http://localhost:3000/seed/
```

7. Ejecutar la aplicación de desarrollo en dev:

```
npm run start:dev
```

## Stack usado

- MongoDB
- NestJs
