export class SkillModel {
  static getCategorizedSkills() {
    return [
      {
        category: "Frontend Core & Rendimiento",
        skills: [
          { name: "Astro", level: "Avanzado", desc: "Islands Architecture, SSG, SSR y optimización de assets" },
          { name: "React", level: "Avanzado", desc: "Hooks, Context, State Management y componentes reactivos" },
          { name: "JavaScript (ES6+)", level: "Avanzado", desc: "Asincronía, DOM API, modularización y manipulación de datos" },
          { name: "TypeScript", level: "Avanzado", desc: "Tipado estricto, interfaces, genéricos y contratos de datos" },
          { name: "HTML5 Semántico", level: "Avanzado", desc: "Accesibilidad (a11y), SEO técnico y estructura óptima" },
          { name: "CSS3 / Modern CSS", level: "Avanzado", desc: "Flexbox, CSS Grid, animaciones GPU y Custom Properties" }
        ]
      },
      {
        category: "Frameworks UI & Animaciones",
        skills: [
          { name: "Tailwind CSS", level: "Avanzado", desc: "Diseño responsive, Glassmorphism, temas custom y JIT" },
          { name: "GSAP & ScrollTrigger", level: "Avanzado", desc: "Animaciones cinemáticas, timelines y efectos de scroll" },
          { name: "Chart.js & Data Viz", level: "Avanzado", desc: "Dashboards analíticos, radares, áreas y métricas visuales" },
          { name: "Lenis Scroll", level: "Avanzado", desc: "Smooth scroll a 120fps y sincronización de eventos" }
        ]
      },
      {
        category: "Herramientas, Cloud & Flujo",
        skills: [
          { name: "Git & GitHub", level: "Avanzado", desc: "Control de versiones, ramas, CI/CD y despliegues" },
          { name: "Figma & Prototipado", level: "Intermedio", desc: "Diseño UI/UX, auto-layout y sistemas de diseño" },
          { name: "Vite / Build Tools", level: "Avanzado", desc: "Empaquetado ultra rápido y configuración de entornos" },
          { name: "REST APIs & JSON", level: "Avanzado", desc: "Consumo de servicios, validación asíncrona y endpoints" }
        ]
      }
    ];
  }

  static getSkills() {
    return [
      "Astro", "React", "JavaScript", "TypeScript",
      "Tailwind CSS", "GSAP", "Chart.js", "HTML5", "CSS3",
      "Git & GitHub", "Figma", "REST APIs"
    ];
  }
}
