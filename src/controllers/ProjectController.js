import { ProjectModel } from '../models/ProjectModel.js';

export class ProjectController {
  /**
   * Obtiene la lista completa de proyectos.
   */
  static getAllProjects() {
    return ProjectModel.getProjects();
  }

  /**
   * Obtiene únicamente los proyectos marcados como destacados.
   */
  static getFeaturedProjects() {
    return ProjectModel.getProjects().filter(p => p.featured);
  }
  
  /**
   * Obtiene las categorías únicas de proyectos para filtros.
   */
  static getCategories() {
    const projects = ProjectModel.getProjects();
    const categories = Array.from(new Set(projects.map(p => p.category)));
    return ['Todos', ...categories];
  }

  /**
   * Filtra proyectos por categoría.
   */
  static getProjectsByCategory(category) {
    const projects = ProjectModel.getProjects();
    if (!category || category === 'Todos') return projects;
    return projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  /**
   * Cuenta cuántos proyectos destacados hay registrados.
   */
  static getProjectCount() {
    return ProjectModel.getProjects().length;
  }
}

