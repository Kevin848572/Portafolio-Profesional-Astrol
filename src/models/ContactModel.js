export class ContactModel {
  /**
   * Valida los campos del formulario de contacto.
   * @param {Object} data - Datos a validar ({ name, email, message, _gotcha }).
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validate(data) {
    const errors = {};
    
    // Protección anti-bot (Honeypot)
    if (data._gotcha && data._gotcha.trim() !== '') {
      return { isValid: false, errors: { bot: 'Solicitud rechazada.' } };
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email.trim())) {
      errors.email = 'Introduce una dirección de correo electrónico válida.';
    }
    
    if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
      errors.message = 'El mensaje debe contener al menos 10 caracteres.';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Sanitiza las cadenas de texto ingresadas.
   * @param {Object} data 
   * @returns {Object}
   */
  static sanitize(data = {}) {
    return {
      name: (data.name || '').toString().trim(),
      email: (data.email || '').toString().trim().toLowerCase(),
      message: (data.message || '').toString().trim(),
      _gotcha: (data._gotcha || '').toString().trim()
    };
  }
}
