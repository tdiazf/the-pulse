# The Pulse

The Pulse es una aplicación web progresiva y moderna para el seguimiento diario de actividad física y entrenamientos. Diseñada con un enfoque en la simplicidad, privacidad y velocidad, almacena todos los datos de progreso de forma segura y local en el propio dispositivo del usuario.

## Características Principales

- **Registro Rápido de Actividad:** Agrega tus minutos de ejercicio guiados por el tipo de actividad (Correr, Gym, Ciclismo, etc.) en un par de toques usando botones de acceso rápido y controles interactivos.
- **Dashboard Estadístico y Visual:** Visualiza gráficamente tu actividad semanal, minutos acumulados de entrenamiento y una estimación de calorías quemadas basado en tus datos.
- **Onboarding Inclusivo:** Crea un perfil inicial en segundos detallando tu edad, género (con soporte para avatar neutral o perfilado) y tu principal objetivo de fitness.
- **Notificaciones In-App:** Recibe confirmaciones dinámicas y avisos conmemorativos que aparecen en tu lista de notificaciones interactiva en el panel superior.
- **100% Offline & Privado:** Gracias al uso de `Dexie.js`, la bóveda de datos vive en tu propio navegador (IndexedDB), haciéndolo extremadamente rápido sin latencia y con completa seguridad sobre tus datos personales.

## Tecnologías Utilizadas

- **Core Visual:** React v19 con TypeScript, empaquetado ultra rápido a través de Vite.
- **Estilos y Pantalla:** Tailwind CSS para una interfaz limpia, adaptativa y 100% custom.
- **Animaciones Fluidas:** `motion/react` para microinteracciones en modales y gráficos de carga.
- **Gráficos de Data:** Integración de la poderosa librería `recharts`.
- **Iconografía Completa:** Icons nítidos renderizados desde `lucide-react`.

## Comandos para Desarrollo Local

Dado que esta aplicación no requiere un backend de terceros, ponerla a correr en tu propio equipo es una tarea de escasos segundos. Asegúrate de tener una versión reciente de Node.js instalada en tu sistema antes de continuar.

1. **Instalar los paquetes del proyecto:**
   ```bash
   npm install
   ```

2. **Levantar el servidor web de desarrollo Vite:**
   ```bash
   npm run dev
   ```

3. Abre el navegador web navegando directamente a [http://localhost:3000](http://localhost:3000). El sistema automáticamente te presentará la pantalla de Onboarding la primera vez.

> **Tip de Pruebas:** Para borrar los datos probados y volver al estado inicial del *Onboarding*, simplemente navega a la pestaña de `Perfil` dentro de la app y presiona en **Cerrar Sesión**. Esto vaciará automáticamente todas las bases de datos de sesión.
