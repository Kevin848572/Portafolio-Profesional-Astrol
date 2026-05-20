export class ContactModel {
  static validate(data) {
    const errors = {};
    
    if (!data.name || data.name.trim() === '') {
      errors.name = 'El nombre es obligatorio.';
    }
    
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'El correo electrónico no es válido o está vacío.';
    }
    
    if (!data.message || data.message.trim() === '') {
      errors.message = 'El mensaje no puede estar vacío.';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
