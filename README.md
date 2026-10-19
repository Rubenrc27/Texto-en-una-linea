# Texto en una línea 📝

Aplicación web moderna desarrollada con **TypeScript** y **Vite** para transformar texto multilínea en una sola línea de manera instantánea, con múltiples separadores, filtros de espacios y copiado rápido al portapapeles.

Optimizado para desplegarse fácilmente en **GitHub Pages** en la ruta de tu proyecto:  
👉 `https://Rubenrc27.github.io/Texto-en-una-linea/`

---

## ✨ Características

- ⚡ **Compilación ultrarrápida y ligera**: Vite + TypeScript sin librerías pesadas.
- 🎨 **Diseño moderno y adaptable**: Modos claro y oscuro con detección de preferencias del sistema y persistencia en `localStorage`.
- 🎛️ **Separadores configurables**: Espacio, nada, comas, punto y coma, barras, tabulación o cualquier símbolo personalizado.
- 🧹 **Opciones de limpieza**: Quitar todos los espacios, recortar márgenes por línea o ignorar líneas vacías.
- 📊 **Estadísticas en tiempo real**: Contador de caracteres, palabras y líneas.
- 📋 **Copiado fiable**: Usa la API moderna de Portapapeles con fallback para entornos seguros o antiguos.
- ⌨️ **Atajos de teclado**: `Ctrl + Enter` (o `⌘ + Enter`) para copiar el resultado al instante.
- 📱 **Diseño responsive & Accesible**: Optimizado para móviles (touch targets de 44px+ y soporte para safe-area de iOS/Android).
- 🤖 **Despliegue automático**: Flujo de GitHub Actions listo para publicar en GitHub Pages.

---

## 🚀 Desarrollo Local

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre en tu navegador la dirección indicada (por defecto `http://localhost:5173`).

### 3. Ejecutar pruebas unitarias

```bash
npm test
```

### 4. Compilar para producción

```bash
npm run build
```

Los archivos finales se generarán en la carpeta `dist/`.

---

## 🌐 Cómo desplegar en GitHub Pages

El proyecto ya incluye el flujo de integración continua en [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) y rutas relativas (`base: './'`) en `vite.config.ts`.

### Paso 1: Subir tus cambios a GitHub

```bash
git add .
git commit -m "Migración a TypeScript y Vite con GitHub Actions"
git push origin main
```

### Paso 2: Activar GitHub Pages en el repositorio

1. En GitHub, ve a tu repositorio y entra en **Settings** (Configuración).
2. En el menú lateral izquierdo, haz clic en **Pages**.
3. En **Source** (Origen), selecciona **GitHub Actions**.
4. ¡Listo! Cada vez que hagas `git push origin main`, la acción compilará y desplegará la web automáticamente.

---

### 🌍 Usar un subdominio propio (Opcional)

Si quieres usar un subdominio propio (por ejemplo `linea.tudominio.com`):

1. En **Settings > Pages > Custom domain**, ingresa tu subdominio (ej: `linea.tudominio.com`) y guarda.
2. En tu proveedor de DNS (Cloudflare, GoDaddy, Namecheap, etc.), añade un registro **CNAME**:
   - **Host/Nombre**: `linea`
   - **Valor/Destino**: `<tu-usuario>.github.io`
3. Marca la casilla **Enforce HTTPS** en GitHub Pages tras verificar el DNS.

---

## 📁 Estructura del proyecto

```text
├── .github/
│   └── workflows/
│       └── deploy.yml      # Despliegue automático a GitHub Pages
├── src/
│   ├── converter.ts        # Lógica pura de transformación y conteo (TS)
│   ├── main.ts             # Control del DOM, eventos, portapapeles y temas
│   └── style.css           # Estilos CSS modernos y variables de tema
├── tests/
│   └── converter.test.ts   # Pruebas unitarias
├── index.html              # Plantilla HTML semántica y accesible
├── package.json            # Scripts y dependencias
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración de empaquetado Vite
```
