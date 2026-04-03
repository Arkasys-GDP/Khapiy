
# ☕ KAPHIY Backend API

Backend del sistema de pedidos web **KAPHIY** para Praliné Coffee House.  
Desarrollado con **NestJS**, diseñado bajo una arquitectura escalable, modular y orientada a microservicios.

---

## 📌 Descripción

Este proyecto implementa una API REST para gestionar:

- Productos (menú)
- Pedidos
- Detalles de pedidos

El sistema está diseñado para integrarse con un frontend tipo **PWA (Next.js)** y permitir pedidos mediante código QR, priorizando una experiencia de usuario rápida y sin fricción.

---

## 🛠️ Stack Tecnológico

- **Framework:** NestJS
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma
- **Validación:** class-validator
- **Configuración:** @nestjs/config

---

## ⚙️ Instalación del proyecto

```bash
npm install
````

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

📌 Nota:

* Este archivo **NO debe subirse al repositorio**
* Usa `.env.example` como referencia

---

## ▶️ Ejecución del proyecto

```bash
# desarrollo
npm run start:dev

# producción
npm run start:prod
```

---

## 🗄️ Base de datos (Prisma + Neon)

Este proyecto utiliza Prisma en modo **Database First**, es decir:

👉 La base de datos ya fue creada previamente mediante SQL.

### Sincronizar Prisma con la BD (ya la tenemos sincronizada solamente colocar el URL en el env)

```bash
npx prisma db pull
npx prisma generate
```

📌 Importante:

* ❌ No usar `prisma migrate`
* ✔ Solo usar `db pull` para sincronizar

---

## 📦 Estructura Futura del proyecto (Puede variar aún no estan creadas las carpetas)

```
src/
 ├── prisma/        # Configuración de Prisma
 ├── product/       # Módulo de productos
 ├── order/         # Módulo de pedidos
 ├── app.module.ts
 └── main.ts

prisma/
 └── schema.prisma
```

---

## 🔌 Endpoints iniciales

### Productos

```
GET /product
POST /product
```

### Pedidos

```
POST /order
```

---

## 🧪 Validaciones

Se utilizan DTOs con:

* `class-validator`
* `class-transformer`

Ejemplo:

```ts
export class CreateProductDto {
  name: string;
  price: number;
}
```

---

## 🌐 CORS

El backend tiene CORS habilitado para permitir conexión con el frontend.

---

## 🚀 Estado del proyecto

🔧 En desarrollo (MVP)

---

## 📈 Próximas mejoras

* Autenticación (JWT)
* Integración con IA (Gemini)
* Procesamiento de voz (Whisper)
* Orquestación con n8n
* Documentación con Swagger
* Contenedorización con Docker

---

## 🐳 Docker (próximamente)

El proyecto será preparado para ejecutarse en contenedores Docker, permitiendo:

* Entornos consistentes
* Despliegue sencillo en la nube
* Escalabilidad

---

## 👥 Equipo

Proyecto desarrollado por el equipo de KAPHIY (ARKASYS):

* Backend
* Frontend
* IA / Documentación
* Gestión

---

## 📄 Licencia

Este proyecto es de uso académico.

---

## 💬 Nota final

Este backend está siendo construido siguiendo buenas prácticas de:

* Arquitectura modular
* Separación de responsabilidades
* Escalabilidad futura
