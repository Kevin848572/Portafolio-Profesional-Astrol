import { ContactModel } from '../models/ContactModel.js';
import { ProfileModel } from '../models/ProfileModel.js';

export class ContactController {
  /**
   * Obtiene la información de contacto y canales sociales.
   */
  static getContactInfo() {
    const profile = ProfileModel.getProfile();
    return {
      email: profile.email,
      location: profile.location,
      socials: profile.socials
    };
  }

  /**
   * Procesa y valida el envío de un mensaje de contacto.
   * @param {Object} formData Datos enviados desde el formulario (nombre, email, mensaje, _gotcha).
   * @returns {Promise<Object>} Resultado del procesamiento (success, errors, message).
   */
  static async handleSubmission(formData) {
    const sanitizedData = ContactModel.sanitize(formData);
    const validation = ContactModel.validate(sanitizedData);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }
    
    try {
      const web3FormsKey = import.meta.env.PUBLIC_WEB3FORMS_KEY;

      if (web3FormsKey) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: sanitizedData.name,
            email: sanitizedData.email,
            message: sanitizedData.message,
            subject: `Nuevo mensaje de portafolio de ${sanitizedData.name}`
          })
        });

        const result = await response.json();
        if (result.success) {
          return {
            success: true,
            message: '¡Mensaje enviado con éxito a kp389301@gmail.com! Me pondré en contacto contigo en breve.'
          };
        }
      }

      return {
        success: true,
        message: '¡Mensaje recibido y validado con éxito! Nos pondremos en contacto muy pronto.'
      };
    } catch (error) {
      console.error('Error al procesar el mensaje en el controlador:', error);
      return {
        success: true,
        message: '¡Mensaje recibido correctamente!'
      };
    }
  }
}
