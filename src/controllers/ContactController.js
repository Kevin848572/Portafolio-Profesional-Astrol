import { ContactModel } from '../models/ContactModel.js';
import { ProfileModel } from '../models/ProfileModel.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

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
   * Procesa, valida y almacena un mensaje de contacto en Supabase.
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
    
    let supabaseSuccess = false;

    // 1. Guardar en Supabase si está configurado
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('contacts')
          .insert([
            {
              name: sanitizedData.name,
              email: sanitizedData.email,
              message: sanitizedData.message
            }
          ]);

        if (error) {
          console.error('Error al insertar en Supabase (contacts):', error);
        } else {
          supabaseSuccess = true;
        }
      } catch (sbError) {
        console.error('Excepción al conectar con Supabase:', sbError);
      }
    }

    // 2. Opcional: Enviar notificación por Web3Forms al correo
    try {
      const web3FormsKey = 
        import.meta.env.PUBLIC_WEB3FORMS_KEY || 
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

