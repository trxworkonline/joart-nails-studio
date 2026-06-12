---
name: joart-deploy
description: Use when setting up the GitHub repository for JoArt Nails Studio or pushing any completed change to main.
---

# JoArt Deploy Workflow (GitHub + Vercel)

## Overview
Workflow de control de versiones y deploy para JoArt Nails Studio: repo en GitHub (vía MCP), Vercel conectado manualmente una vez, luego auto-deploy en cada push a `main`.

## Setup inicial (una sola vez)
1. Crear repo público `joart-nails-studio` con el MCP de GitHub.
2. `git init` (si no existe ya — `create-next-app` lo inicializa automáticamente).
3. `git remote add origin <url-del-repo>`.
4. Commit inicial + `git push -u origin main`.
5. Dar la URL del repo al usuario para que conecte Vercel manualmente.

## Workflow por cada cambio
```
git add .
git commit -m "<descripción en español>"
git push origin main
```

## Reglas
- **NUNCA** pushear código roto o incompleto — correr `npm run build` (o al menos `npm run lint`) antes de pushear si se tocó algo estructural.
- Mensajes de commit descriptivos **en español**, en modo imperativo (ej. "agrega sección hero con animación de entrada").
- Un commit por unidad de trabajo completa (no mezclar features no relacionadas).

## Tras conectar Vercel
Cada push a `main` dispara un deploy automático. Si el usuario reporta que el deploy falló, revisar:
- Logs de build de Vercel (errores de `next build`).
- Que `npm run build` pase localmente antes de pushear de nuevo.

## Common Mistakes
- Pushear con `npm run build` fallando localmente.
- Mensajes de commit genéricos ("update", "fix") — deben describir el QUÉ del cambio.
- Olvidar `git push` después de commitear (el usuario espera ver el deploy reflejado).
