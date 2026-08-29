import { ProfileModel } from '../models/ProfileModel.js';

export class ProfileController {
  /**
   * Obtiene la información necesaria para la sección Hero.
   */
  static getHeroData() {
    const profile = ProfileModel.getProfile();
    return {
      name: profile.name,
      role: profile.role,
      status: profile.status,
      title: profile.title,
      subtitle: profile.subtitle,
      imageUrl: profile.imageUrl,
      email: profile.email,
      cvUrl: profile.cvUrl,
      stats: profile.stats,
      socials: profile.socials
    };
  }

  /**
   * Obtiene la información básica de contacto y redes sociales.
   */
  static getContactChannels() {
    const profile = ProfileModel.getProfile();
    return {
      email: profile.email,
      location: profile.location,
      socials: profile.socials
    };
  }

  /**
   * Obtiene la información necesaria para el pie de página (footer).
   */
  static getFooterData() {
    const profile = ProfileModel.getProfile();
    return {
      year: new Date().getFullYear(),
      name: profile.name,
      copyText: `${profile.name} — Desarrollador Frontend. Todos los derechos reservados.`
    };
  }
}

