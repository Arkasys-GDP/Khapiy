# Informe de Construcción: Módulo de Cliente (PWA Praliné Coffee House)

**Entregable Trello:** Construir Módulo Cliente  
**Proyecto:** Kaphiy (Praliné Coffee House)  

---

## 1. Resumen Ejecutivo
Este documento detalla la implementación y construcción del **Módulo de Cliente** para la aplicación web progresiva (PWA) de Praliné Coffee House. El desarrollo se ha centrado en traducir fielmente los mockups y wireframes aprobados a código interactivo, integrando el sistema de diseño y paleta de colores oficial de la marca, así como estableciendo la conectividad dinámica con el backend (NestJS).

## 2. Políticas y Estándares de Calidad Visual

Para asegurar que el ecosistema digital mantenga la elegancia de **Praliné Coffee House**, se implementan las siguientes políticas de construcción obligatorias:

1. **Estándar de Bordes Orgánicos:** Se establece un *border-radius* mandatorio de **20px** para todos los contenedores, tarjetas y botones, reforzando una estética moderna y amigable.
2. **Jerarquía Tipográfica Dual:** Uso estricto de *Playfair Display* para encabezados (transmitiendo la tradición artesanal) e *Inter* para el cuerpo de texto y controles técnicos (priorizando la legibilidad en pantallas móviles).
3. **Política de Espaciado y Rejilla:** Implementación de un sistema de *Layout* basado en **CSS Grid** y **Flexbox** con espaciados constantes (16px y 24px) para evitar la saturación visual en dispositivos táctiles.

## 3. Especificación Técnica de los Módulos del Sistema

### Módulo 1: Onboarding y Splash Screen
* **Funcionalidad:** Primera capa de interacción tras el escaneo del código QR.
* **Componentes:** Animación de entrada con el isotipo de Praliné y botones de acción rápida ("Pedir con IA" o "Explorar Menú").
* **Técnica:** Implementado con *Framer Motion* para transiciones suaves y detección automática de la mesa mediante parámetros en la URL.

### Módulo 2: Menú Digital Dinámico (Catálogo)
* **Funcionalidad:** Visualización estructurada de productos (Cafés, Repostería, Especialidades).
* **Componentes:** Chips de filtrado por categoría, barra de búsqueda en tiempo real y *Skeletons* de carga para optimizar el *LCP*.
* **Técnica:** Consumo de datos desde NestJS mediante *Server-Side Rendering (SSR)* para garantizar velocidad en dispositivos de gama baja.

### Módulo 3: Asistente Gastronómico IA (Chatbot)
* **Funcionalidad:** Motor de recomendación y toma de pedidos por lenguaje natural.
* **Componentes:** Ventana de chat persistente, burbujas de mensaje con *Glassmorphism* y renderizado de *Product Cards* dentro del flujo conversacional.
* **Técnica:** Integración de la API de **Gemini 1.5 Flash** con *System Prompting* específico para el menú de Praliné.

### Módulo 4: Procesamiento de Voz (Voice-to-Text)
* **Funcionalidad:** Interfaz de captura de audio para realizar pedidos mediante notas de voz.
* **Componentes:** Botón de micrófono flotante con ondas de animación dinámicas y visualización de transcripción en tiempo real.
* **Técnica:** Captura de *stream* de audio del navegador enviada al microservicio de **Whisper.cpp** para su procesamiento.

### Módulo 5: Gestión de Carrito y Checkout
* **Funcionalidad:** Resumen de la orden, modificación de cantidades y gestión de extras.
* **Componentes:** Drawer (panel deslizable) de carrito, contador de productos y desglose de subtotales.
* **Técnica:** Manejo de estado global mediante *Context API* para persistir el pedido mientras el usuario navega.

### Módulo 6: Seguimiento de Pedido (Status)
* **Funcionalidad:** Vista de espera donde el cliente ve en qué fase está su café.
* **Componentes:** Línea de tiempo interactiva (Recibido -> En Preparación -> Listo).
* **Técnica:** Conexión vía *WebSockets* para actualización de estados sin recargar la página.

### Módulo 7: Dashboard de Operaciones (Kitchen View)
* **Funcionalidad:** Interfaz de control para el personal de la cafetería.
* **Componentes:** Grilla de comandas con semaforización de tiempo y botones de cambio de estado.
* **Técnica:** Layout multi-columna optimizado para tablets con persistencia de estados hacia el backend.

## 4. Integración y Conectividad Backend
* **Conexión con NestJS:** Integración de la PWA con la API del backend para consumo de categorías, productos e información del negocio, abandonando por completo el uso de *mock data*.
* **Gestión de Red Local:** Configuración de directivas CORS e IP binding (0.0.0.0) para permitir que el cliente sea testeado desde cualquier dispositivo móvil dentro de la red.

## 5. Próximos Pasos y Consideraciones
1. Validar el flujo de caja/carrito de compras completo.
2. Refinar los prompts y conectividad lógica del agente Gemini con el módulo de chat.
3. Despliegue en entorno de pruebas (Staging) para validación de rendimiento en dispositivos móviles reales.
