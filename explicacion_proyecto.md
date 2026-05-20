# Plan de Implementación y Guía del Portafolio: Arquitectura MVC en Astro

¡Felicidades! Hemos reestructurado y organizado el 100% de este proyecto para adoptar una arquitectura **Modelo-Vista-Controlador (MVC)** de grado profesional. 

Esta guía te explicará cómo funciona esta arquitectura en Astro, la estructura exacta del proyecto, el flujo de datos y el plan de implementación paso a paso que hemos completado para lograrlo.

---

## 1. Plan de Implementación (Completado)

El plan consistió en separar la lógica de enrutamiento propia de Astro de la lógica visual del portafolio. Para ello, creamos tres carpetas principales bajo `src/`:

```mermaid
graph TD
    subgraph Capa 1: Modelo (src/models)
        M1[ProfileModel]
        M2[ProjectModel]
        M3[SkillModel]
        M4[ContactModel]
    end

    subgraph Capa 2: Controlador (src/controllers)
        C1[ProfileController]
        C2[ProjectController]
        C3[SkillController]
        C4[ContactController]
    end

    subgraph Capa 3: Vista (src/views)
        V1[HomeView.astro]
        V2[ProjectsView.astro]
        V3[SkillsView.astro]
        V4[ContactView.astro]
        VLayout[layouts/Layout.astro]
        VNavbar[components/Navbar.astro]
        VHero[components/Hero.astro]
    end

    subgraph Enrutador Astro (src/pages)
        R1[index.astro]
        R2[proyectos.astro]
        R3[habilidades.astro]
        R4[contactar.astro]
    end

    R1 --> V1
    R2 --> V2
    R3 --> V3
    R4 --> V4

    V1 --> C1
    V2 --> C2 & C1
    V3 --> C3 & C1
    V4 --> C4

    C1 --> M1
    C2 --> M2
    C3 --> M3
    C4 --> M4
```

### Pasos Ejecutados:
1.  **Definición de Modelos (`src/models/`):** Aislamos los datos de configuración del portafolio (textos de perfil, habilidades, lista de proyectos) en clases JavaScript puras.
2.  **Definición de Controladores (`src/controllers/`):** Escribimos la lógica de procesamiento (como el cálculo dinámico del año de copyright del footer y la lógica de validación de campos del formulario).
3.  **Construcción de Vistas Reales (`src/views/`):** Trasladamos toda la interfaz gráfica de usuario (los componentes `Hero`, `Navbar`, el diseño `Layout` y las páginas `HomeView`, `ProjectsView`, `SkillsView`, `ContactView`) a una carpeta de vistas independiente.
4.  **Creación de Wrappers en el Enrutador (`src/pages/`):** Dejamos las páginas de Astro como simples archivos de redirección que importan y renderizan su vista correspondiente en `src/views/`.
5.  **Limpieza del Proyecto:** Eliminamos las carpetas duplicadas e inactivas (`src/components/` y `src/layouts/` antiguas) para mantener el espacio de trabajo limpio.
6.  **Validación y Compilación:** Compilamos el proyecto satisfactoriamente con `npm run build` en 1.6 segundos.

---

## 2. Organización en Tres Carpetas Principales

### 📂 1. Capa del Modelo (`src/models/`)
Gestiona de forma exclusiva los datos, esquemas y reglas de validación.

*   `ProfileModel.js`: Contiene el nombre, cargo, biografía, redes sociales y dirección de correo.
*   `ProjectModel.js`: Contiene la lista de proyectos destacados con sus descripciones y etiquetas tecnológicas.
*   `SkillModel.js`: Contiene el listado completo de habilidades técnicas para el portafolio.
*   `ContactModel.js`: Ejecuta la validación técnica del formulario de contacto (valida formato de correo y longitud de campos).

### 📂 2. Capa del Controlador (`src/controllers/`)
Actúa como puente de enlace y contiene la lógica de negocio que las vistas consumen.

*   `ProfileController.js`: Genera los datos adaptados para la sección Hero, para el footer (calculando el año en tiempo real) y los canales de comunicación.
*   `ProjectController.js`: Proporciona la lista de proyectos destacados y contadores listos para renderizar.
*   `SkillController.js`: Retorna el conjunto ordenado de habilidades técnicas.
*   `ContactController.js`: Valida los datos enviados desde la vista de contacto usando el `ContactModel` y procesa su estado.

### 📂 3. Capa de la Vista (`src/views/`)
Contiene todos los componentes gráficos, interfaces del usuario, estilos de Tailwind CSS y animaciones en pantalla.

*   `src/views/layouts/Layout.astro`: Define la cabecera HTML5, carga fuentes tipográficas (Inter) y dibuja las luces difusas del fondo.
*   `src/views/components/Navbar.astro`: La barra de navegación común e interactiva.
*   `src/views/components/Hero.astro`: Dibuja el hero del portafolio con efecto espejo y consume datos de `ProfileController`.
*   `src/views/HomeView.astro`: Vista maestra de la página de inicio.
*   `src/views/ProjectsView.astro`: Diseña la cuadrícula de artículos con efectos de brillo y glow interactivo.
*   `src/views/SkillsView.astro`: Maqueta las tarjetas de habilidades técnicas.
*   `src/views/ContactView.astro`: El formulario de contacto premium con desenfoque de cristal (glassmorphism).

---

## 3. ¿Cómo funciona el Flujo de Datos?

1.  **Entrada:** El navegador solicita la URL `/proyectos`.
2.  **Ruta (`src/pages/proyectos.astro`):** Es muy corta y solo dice:
    ```astro
    ---
    import ProjectsView from '../views/ProjectsView.astro';
    ---
    <ProjectsView />
    ```
3.  **Vista (`src/views/ProjectsView.astro`):** Ejecuta su Frontmatter para pedir datos al Controlador:
    ```astro
    ---
    import { ProjectController } from '../controllers/ProjectController.js';
    const projects = ProjectController.getFeaturedProjects();
    ---
    ```
4.  **Controlador (`src/controllers/ProjectController.js`):** Pide los proyectos crudos al modelo `ProjectModel.getProjects()` y los procesa si es necesario.
5.  **Modelo (`src/models/ProjectModel.js`):** Retorna el arreglo de datos estáticos en formato JSON.
6.  **Pintado HTML:** La vista de proyectos procesa el arreglo usando `.map()` y renderiza la interfaz visual al cliente.

---

## 4. Ventajas Profesionales de este Diseño

*   **Mantenibilidad Extrema:** Modificar un texto o una habilidad no requiere tocar ningún archivo `.astro` o HTML. Solo modificas el modelo correspondiente en un archivo JS estándar.
*   **Separación Total de Conceptos:** Los diseñadores de interfaz pueden trabajar dentro de `src/views/` con CSS y Tailwind sin temor a romper la lógica de datos de los controladores o modelos.
*   **Preparación para Base de Datos / Backend:** Si decides que tus proyectos se guarden en una base de datos (PostgreSQL, MongoDB) o consumirlos desde una API real, **únicamente debes modificar el código del `ProjectModel`**. Toda la estructura de vistas y controladores seguirá funcionando exactamente igual, ahorrándote semanas de refactorización.
