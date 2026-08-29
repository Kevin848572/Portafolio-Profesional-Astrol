import { SkillModel } from '../models/SkillModel.js';

export class SkillController {
  /**
   * Obtiene la lista estructurada de habilidades por categorías.
   */
  static getCategorizedSkills() {
    return SkillModel.getCategorizedSkills();
  }

  /**
   * Obtiene la lista simple de nombres de habilidades.
   */
  static getAllSkills() {
    return SkillModel.getSkills();
  }
}

