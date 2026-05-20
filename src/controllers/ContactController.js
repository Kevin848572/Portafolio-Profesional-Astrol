import { ContactModel } from '../models/ContactModel.js';

export class ContactController {
  /**
   * Procesa y valida el envío de un mensaje de contacto.
   * @param {Object} formData Datos enviados desde el formulario (nombre, email, mensaje).
   * @returns {Object} Un objeto con el estado del procesamiento (success, errors, message).
   */
  static handleSubmission(formData) {
    const validation = ContactModel.validate(formData);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }
    
    // Aquí puedes expandir para conectar a una base de datos o enviar a un servicio como Formspree o Resend.
    // console.log("Mensaje válido recibido y procesado:", formData);
    
    return {
      success: true,
      message: '¡Mensaje validado y enviado con éxito!'
    };
  }
}
