export class ProjectModel {
  static getProjects() {
    return [
      {
        id: "prestaciones-laborales",
        title: "Prestaciones Laborales Hondureñas",
        desc: "Plataforma empresarial para el registro laboral de empleados y cálculo automatizado de prestaciones sociales según el Código de Trabajo de Honduras.",
        longDesc: "Solución integral desarrollada para departamentos de Recursos Humanos que automatiza el cálculo exacto de preaviso, cesantía, vacaciones y décimos salarios según la legislación hondureña. Incluye autenticación corporativa, desglose financiero instantáneo y emisión de constancias formales.",
        category: "Sistemas",
        tags: ["JavaScript ES6+", "HTML5 Semántico", "CSS3 / Glassmorphism", "Legislación Laboral", "Cálculos Financieros"],
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
        demoUrl: "https://aplicacion-prestaciones-laborales-h.vercel.app/",
        githubUrl: "https://github.com/Kevin848572/Aplicacion-Prestaciones-laborales-hondure-as.",
        featured: true
      },
      {
        id: "samsung-talent-dashboard",
        title: "Samsung Talent Dashboard",
        desc: "Dashboard analítico corporativo para el monitoreo de KPIs de talento humano, capacitación continua y evaluación de competencias técnicas de Samsung Electronics Regional.",
        longDesc: "Plataforma de inteligencia de negocio y analítica de RRHH diseñada para diagnosticar y visualizar el desarrollo del talento técnico en tiempo real. Integra métricas de horas formativas, análisis de brechas por dimensión, visualización de tendencias con Chart.js, exportación de informes ejecutivos en PDF y arquitectura de islas reactivas con Astro y Tailwind CSS.",
        category: "Frontend",
        tags: ["Astro", "Tailwind CSS", "Chart.js", "Business Intelligence", "Dashboard Analytics"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        demoUrl: "https://samsung-talent-dashboard.vercel.app/",
        githubUrl: "https://github.com/Kevin848572/samsung-talent-dashboard",
        featured: true
      },
      {
        id: "dashboard-kpi-rrhh",
        title: "Dashboard KPI RRHH - Cervecería Hondureña",
        desc: "Panel de control estratégico y telemetría de Recursos Humanos para el análisis de rotación, retención, productividad y clima laboral con métricas en tiempo real.",
        longDesc: "Cuadro de mando integral para la dirección de talento humano que centraliza indicadores críticos de desempeño (KPIs). Presenta análisis dinámicos de rotación de personal, costos de reclutamiento, índices de satisfacción y distribución por departamento mediante gráficos interactivos de alta fidelidad.",
        category: "Frontend",
        tags: ["JavaScript ES6+", "Chart.js", "CSS Grid / Flexbox", "Data Visualization", "People Analytics"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        demoUrl: "https://dashboard-kpi-rrhh.vercel.app",
        githubUrl: "https://github.com/Kevin848572/dashboard_kpi_rrhh",
        featured: true
      },
      {
        id: "inventario-cerveceria",
        title: "Inventario de Personal - Cervecería Hondureña",
        desc: "Sistema corporativo de gestión del capital humano de TI para Cervecería Hondureña: matriz de personal, diagnóstico de competencias y detección de brechas críticas.",
        longDesc: "Plataforma especializada en la gestión estratégica de talento técnico para la Dirección de Tecnología. Integra censo de colaboradores, matriz de competencias por niveles de dominio, mapa de severidad de brechas (Ciberseguridad/SOC, Cloud, DevOps), modelo de madurez TI y exportación automatizada de reportes en CSV y PDF para auditorías.",
        category: "Fullstack",
        tags: ["Astro", "TypeScript", "Tailwind CSS", "Matriz de Competencias", "Auditoría TI"],
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
        demoUrl: "https://inventario-de-personal-cerveria-hon.vercel.app/",
        githubUrl: "https://github.com/Kevin848572/Inventario-de-Personal-Cerveria-Hondure-o",
        featured: true
      },
      {
        id: "cerveceria-skms",
        title: "Prototipo Cervecería Hondureña (SKMS)",
        desc: "Sistema de Gestión del Conocimiento (SKMS) para plantas y logística de Cervecería Hondureña: centralización de manuales técnicos, lecciones aprendidas y SOPs.",
        longDesc: "Plataforma empresarial de Knowledge Management diseñada para preservar y transferir el conocimiento crítico industrial y operativo. Incorpora autenticación con control de roles, buscador contextual instantáneo, categorización por áreas (Operativo, Administrativo, Distribución), visor de procedimientos paso a paso y formulario interactivo para aporte colaborativo de lecciones técnicas.",
        category: "Frontend",
        tags: ["Astro", "Tailwind CSS", "JavaScript", "Knowledge Management", "UI/UX Corporativo"],
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
        demoUrl: "https://prototipo-cerveria-hondure-a-skms.vercel.app/",
        githubUrl: "https://github.com/Kevin848572/Prototipo-Cerveria-Hondure-a--SKMS",
        featured: false
      },
      {
        id: "apis-banderas",
        title: "APIs de Banderas del Mundo & Geografía Pro",
        desc: "Explorador geopolítico interactivo en tiempo real que consume REST Countries API para visualizar banderas, datos demográficos, geografía y un quiz de conocimientos.",
        longDesc: "Aplicación web moderna y reactiva construida con Vite, React y Tailwind CSS para la consulta instantánea de datos geopolíticos globales. Dispone de búsqueda predictiva en tiempo real, filtros avanzados por región geográfica y población, fichas técnicas detalladas con mapas interactivos y un modo quiz interactivo para evaluar conocimientos.",
        category: "Frontend",
        tags: ["React", "Vite", "REST Countries API", "Tailwind CSS", "Quiz Interactivo"],
        image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop",
        demoUrl: "https://apis-de-banderas-5.vercel.app/",
        githubUrl: "https://github.com/Kevin848572/APIs-de-Banderas",
        featured: false
      },
      {
        id: "test-personalidad",
        title: "Test de Personalidad Interactivo",
        desc: "Evaluador psicométrico interactivo para perfiles profesionales y conductuales con algoritmo de ponderación en tiempo real y análisis de compatibilidad.",
        longDesc: "Aplicación web interactiva con interfaz estética y micro-interacciones fluidas, orientada a la selección de personal y autoevaluación de competencias blandas. Evalúa dimensiones clave de liderazgo, resolución bajo presión y trabajo en equipo mediante un algoritmo de puntuación reactivo, entregando un desglose gráfico inmediato y recomendaciones personalizadas.",
        category: "Frontend",
        tags: ["React", "JavaScript ES6+", "Algoritmos", "Tailwind CSS", "Psicometría Web"],
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
        demoUrl: "https://test-de-personalidad-ecru.vercel.app/",
        githubUrl: "https://github.com/Kevin848572/Test-de-personalidad",
        featured: false
      },
      {
        id: "taller-mecanico",
        title: "Sistema de Taller Mecánico (S.A.V.)",
        desc: "Sistema Administrativo de Vehículos (S.A.V.) y taller automotriz corporativo: gestión de flota, órdenes de trabajo, repuestos y control de mantenimiento.",
        longDesc: "Plataforma integral de gestión automotriz desarrollada con Angular 18, arquitectura modular y diseño Neobrutalism. Permite el control completo del ciclo de vida del vehículo en taller: ingreso y fichas técnicas, asignación de mecánicos, diagnóstico de fallas, inventario de repuestos, órdenes de trabajo con cálculo de costos y reportes operativos.",
        category: "Fullstack",
        tags: ["Angular 18", "TypeScript", "Neobrutalism UI", "Gestión de Flota", "PostgREST"],
        image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&auto=format&fit=crop",
        demoUrl: "https://prototipo-taller-mecanico-1.vercel.app/#/",
        githubUrl: "https://github.com/Kevin848572/Prototipo-taller-mecanico",
        featured: false
      }
    ];
  }
}
