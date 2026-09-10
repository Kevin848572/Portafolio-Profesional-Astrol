import { ContactModel } from '../models/ContactModel.js';
import { ProfileModel } from '../models/ProfileModel.js';
import { db, isFirebaseConfigured, collection, addDoc } from '../lib/firebase.js';

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
   * Procesa, valida y almacena un mensaje de contacto en Firebase Firestore.
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

    // 1. Guardar vía Firebase Firestore si está configurado
    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'contacts'), {
          name: sanitizedData.name,
          email: sanitizedData.email,
          message: sanitizedData.message,
          created_at: new Date().toISOString()
        });
      } catch (fbError) {
        console.warn('Excepción al guardar en Firebase Firestore:', fbError);
      }
    }

    // 2. Opcional: Enviar notificación por Web3Forms al correo
    try {
      const web3FormsKey = 
        (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_WEB3FORMS_KEY) || 
        (typeof process !== 'undefined' ? process.env?.PUBLIC_WEB3FORMS_KEY : '');

      if (web3FormsKey) {
        await fetch('https://api.web3forms.com/submit', {
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
      }
    } catch (error) {
      console.warn('Web3Forms notification skipped or failed:', error);
    }

    return {
      success: true,
      message: '¡Mensaje recibido y guardado con éxito! Me pondré en contacto contigo en breve.'
    };
  }
}
