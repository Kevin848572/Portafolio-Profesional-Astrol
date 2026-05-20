import { ProfileModel } from '../models/ProfileModel.js';

export class ProfileController {
  /**
   * Obtiene la información necesaria para la sección Hero.
   */
  static getHeroData() {
    const profile = ProfileModel.getProfile();
    return {
      title: profile.title,
      subtitle: profile.subtitle,
      imageUrl: profile.imageUrl,
      email: profile.email
    };
  }

  /**
   * Obtiene la información básica de contacto y redes sociales.
   */
  static getContactChannels() {
    const profile = ProfileModel.getProfile();
    return {
      email: profile.email,
      socials: profile.socials
    };
  }

  /**
   * Obtiene la información necesaria para el pie de página (footer).
   */
  static getFooterData() {
    return {
      year: new Date().getFullYear(),
      copyText: "Desarrollador Frontend. Todos los derechos reservados."
    };
  }
}
