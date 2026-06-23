# DI/UX — Decision Intelligence Platform

Plataforma interna de inteligencia de decisiones para equipos ágiles de producto.

---

## ⚠️ Importante: el proyecto necesita compilarse

Los archivos JSX no se pueden abrir directamente en el navegador. Necesitás usar uno de los métodos de deploy que se explican abajo.

---

## 🚀 Opción A — Vercel (más fácil, recomendado)

1. Entrá a **[vercel.com](https://vercel.com)** e iniciá sesión con tu cuenta de GitHub
2. Hacé clic en **"Add New → Project"**
3. Buscá y seleccioná tu repositorio `diux-platform`
4. Vercel detecta Vite automáticamente — dejá todo como está
5. **(Opcional)** Para el Agente IA, en **"Environment Variables"** agregá:
   - Name: `VITE_ANTHROPIC_API_KEY`
   - Value: tu clave `sk-ant-...`
6. Hacé clic en **"Deploy"**

✅ En 2 minutos la app está en línea. Cada push a `main` redeploya automáticamente.

---

## 🔧 Opción B — GitHub Pages (automático con Actions)

El repo ya incluye `.github/workflows/deploy.yml`.

1. En tu repo → **Settings → Pages → Source → "GitHub Actions"**
2. Hacer push a `main` (o ir a **Actions → Run workflow**)
3. La app aparece en `https://tu-usuario.github.io/diux-platform/`

> Si la URL incluye el nombre del repo (no está en la raíz), editá `vite.config.js` y cambiá `base: "/"` por `base: "/diux-platform/"`.

Para el Agente IA: **Settings → Secrets and variables → Actions → New secret** → `VITE_ANTHROPIC_API_KEY`.

---

## 💻 Correr localmente

```bash
npm install
cp .env.example .env
npm run dev
```

---

*DI/UX v1.0 · Telecom / Personal Argentina*
