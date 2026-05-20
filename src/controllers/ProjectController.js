import { ProjectModel } from '../models/ProjectModel.js';

export class ProjectController {
  /**
   * Obtiene la lista completa de proyectos listos para ser renderizados.
   */
  static getFeaturedProjects() {
    return ProjectModel.getProjects();
  }
  
  /**
   * Cuenta cuántos proyectos destacados hay registrados.
   */
  static getProjectCount() {
    return ProjectModel.getProjects().length;
  }
}
