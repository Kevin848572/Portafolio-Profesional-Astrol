# Guía Paso a Paso para Subir Cambios a GitHub

¡Hola! Esta es una guía rápida y sencilla para que puedas subir a GitHub todos los cambios que le hagas a tu portafolio en el futuro (por ejemplo, cuando edites un proyecto en `src/models/ProjectModel.js` o agregues una nueva vista en `src/views/`).

Sigue estos **4 sencillos pasos** desde tu terminal cada vez que quieras actualizar tu repositorio en internet:

---

## 1. Abrir la Terminal en tu Proyecto
Asegúrate de estar en la carpeta raíz de tu proyecto (`Portafolio-Astro`).

---

## 2. Verificar qué archivos has modificado (Opcional)
Antes de guardar tus cambios, es una buena práctica ver qué archivos has editado o agregado. Ejecuta:

```bash
git status
```

*   **En rojo:** Verás los archivos que modificaste o creaste pero que aún no se han preparado para subirse.
*   **En verde:** Verás los archivos que ya están listos para el commit.

---

## 3. Preparar los Archivos (Staging)
Le dices a Git cuáles de tus cambios modificados quieres guardar. Si quieres guardar **todos** los cambios del proyecto, ejecuta:

```bash
git add .
```

> 💡 *Nota: El punto (`.`) le indica a Git que agregue todos los archivos nuevos y modificados de la carpeta actual hacia abajo (excluyendo lo que esté en tu `.gitignore`).*

---

## 4. Guardar los Cambios Localmente (Commit)
Crea una "foto de control" de tus cambios y agrégale un mensaje descriptivo y profesional que explique brevemente qué modificaste:

```bash
git commit -m "feat: agregar nuevo proyecto a la galeria"
```

### 💡 Buenas prácticas para tus mensajes de commit:
*   `feat: ...` -> Para nuevas funcionalidades o adición de datos (ej. `feat: agregar boton de descarga de CV`).
*   `fix: ...` -> Para corregir errores o bugs (ej. `fix: corregir enlace roto en la barra de navegacion`).
*   `docs: ...` -> Para cambios exclusivos en la documentación (ej. `docs: actualizar guia de Git`).

---

## 5. Subir los Cambios a GitHub (Push)
Finalmente, envía todos tus commits guardados en tu máquina local directamente a tu repositorio de GitHub en internet:

```bash
git push origin main
```

¡Eso es todo! Abre tu navegador en [https://github.com/Kevin848572/Portafolio-Astro](https://github.com/Kevin848572/Portafolio-Astro) y verás que tus cambios y tu último mensaje de commit ya están publicados.

---

### ⚠️ Resumen de Comandos Rápidos (Copiar y Pegar)
Cuando tengas prisa, solo abre la terminal y ejecuta estos tres comandos en orden:

```bash
git add .
git commit -m "Escribe aqui tus cambios realizados"
git push origin main
```
