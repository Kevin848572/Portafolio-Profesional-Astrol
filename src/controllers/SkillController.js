import { SkillModel } from '../models/SkillModel.js';

export class SkillController {
  /**
   * Obtiene la lista ordenada de habilidades.
   */
  static getAllSkills() {
    return SkillModel.getSkills();
  }
}
