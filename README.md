<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
## curl
🧩 1️⃣ Usuarios y Autenticación
🟢 Registro de usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "123456",
    "name": "Usuario Prueba"
  }'


📤 Respuesta esperada:

{
  "id": 1,
  "email": "user@example.com",
  "name": "Usuario Prueba",
  "role": "user"
}

🔵 Login de usuario
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "123456"
  }'


📤 Respuesta esperada:

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
}


💡 Guarda el token para usarlo en los siguientes endpoints:

TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

🧭 Verificar token
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN"

👥 2️⃣ Usuarios (solo admin)
📋 Listar todos los usuarios
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"


🔒 Solo accesible si el token pertenece a un admin.

🔍 Obtener un usuario por ID
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"

🧾 Obtener un usuario con todos sus pedidos
curl -X GET http://localhost:3000/users/1/orders \
  -H "Authorization: Bearer $TOKEN"

🛒 3️⃣ Productos
➕ Crear un producto (admin)
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Producto A" \
  -F "description=Un producto de prueba" \
  -F "price=29.99" \
  -F "images=@/ruta/a/imagen1.jpg" \
  -F "images=@/ruta/a/imagen2.png"


📤 Respuesta esperada:

{
  "id": 1,
  "name": "Producto A",
  "price": 29.99,
  "images": [
    { "url": "uploads/imagen1.jpg" },
    { "url": "uploads/imagen2.png" }
  ]
}

📋 Listar productos
curl -X GET http://localhost:3000/products

🔍 Obtener un producto por ID
curl -X GET http://localhost:3000/products/1

✏️ Actualizar un producto (admin)
curl -X PATCH http://localhost:3000/products/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Producto A actualizado",
    "price": 39.99
  }'

🗑️ Eliminar un producto (admin)
curl -X DELETE http://localhost:3000/products/1 \
  -H "Authorization: Bearer $TOKEN"

📦 4️⃣ Pedidos
🆕 Crear pedido
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lines": [
      { "productId": 1, "quantity": 2 },
      { "productId": 2, "quantity": 1 }
    ]
  }'


📤 Respuesta esperada:

{
  "id": 1,
  "total": 89.97,
  "lines": [
    { "id": 1, "productId": 1, "quantity": 2, "price": 29.99 },
    { "id": 2, "productId": 2, "quantity": 1, "price": 29.99 }
  ]
}

📋 Listar todos los pedidos del usuario logueado
curl -X GET http://localhost:3000/orders \
  -H "Authorization: Bearer $TOKEN"

🔍 Obtener pedido por ID (con líneas)
curl -X GET http://localhost:3000/orders/1 \
  -H "Authorization: Bearer $TOKEN"

🗑️ Eliminar pedido
curl -X DELETE http://localhost:3000/orders/1 \
  -H "Authorization: Bearer $TOKEN"

⚙️ 5️⃣ Roles (solo admin)
🔄 Actualizar rol de usuario
curl -X PATCH http://localhost:3000/users/2/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
# nestjs-tienda-api-v1
# nestjs11-tienda-api-v2
