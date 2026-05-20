export class ProjectModel {
  static getProjects() {
    return [
      { 
        title: "E-Commerce Premium", 
        desc: "Plataforma de ventas con diseño minimalista y alto rendimiento.", 
        tags: ["Astro", "Tailwind"] 
      },
      { 
        title: "Dashboard Analítico", 
        desc: "Panel de control en tiempo real con gráficos dinámicos.", 
        tags: ["React", "Tailwind"] 
      },
      { 
        title: "App de Finanzas", 
        desc: "Gestión de gastos inteligente con diseño glassmorphism.", 
        tags: ["Svelte", "CSS"] 
      }
    ];
  }
}
