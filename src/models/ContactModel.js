export class ContactModel {
  /**
   * Valida los campos del formulario de contacto con límites estrictos.
   * @param {Object} data - Datos a validar ({ name, email, message, _gotcha }).
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validate(data) {
    const errors = {};
    
    // Protección anti-bot (Honeypot)
    if (data._gotcha && data._gotcha.trim() !== '') {
      return { isValid: false, errors: { bot: 'Solicitud rechazada.' } };
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.trim().length > 100) {
      errors.name = 'El nombre debe tener entre 2 y 100 caracteres.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || typeof data.email !== 'string' || data.email.length > 254 || !emailRegex.test(data.email.trim())) {
      errors.email = 'Introduce una dirección de correo electrónico válida (máximo 254 caracteres).';
    }
    
    if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10 || data.message.trim().length > 3000) {
      errors.message = 'El mensaje debe tener entre 10 y 3000 caracteres.';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Sanitiza y trunca las cadenas de texto ingresadas para mitigar ataques DoS.
   * @param {Object} data 
   * @returns {Object}
   */
  static sanitize(data = {}) {
    return {
      name: (data.name || '').toString().trim().slice(0, 100),
      email: (data.email || '').toString().trim().toLowerCase().slice(0, 254),
      message: (data.message || '').toString().trim().slice(0, 3000),
      _gotcha: (data._gotcha || '').toString().trim().slice(0, 100)
    };
  }
}
