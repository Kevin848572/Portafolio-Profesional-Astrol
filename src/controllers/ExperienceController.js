import { ExperienceModel } from '../models/ExperienceModel.js';

export class ExperienceController {
  /**
   * Obtiene todos los hitos y experiencias profesionales ordenadas cronológicamente.
   */
  static getTimeline() {
    return ExperienceModel.getExperiences();
  }
}
