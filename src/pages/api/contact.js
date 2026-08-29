import { ContactController } from '../../controllers/ContactController.js';

export const prerender = false;

export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let formData = {};

    if (contentType.includes('application/json')) {
      formData = await request.json();
    } else if (contentType.includes('form-data') || contentType.includes('x-www-form-urlencoded')) {
      const data = await request.formData();
      formData = {
        name: data.get('name'),
        email: data.get('email'),
        message: data.get('message'),
        _gotcha: data.get('_gotcha')
      };
    }

    const result = await ContactController.handleSubmission(formData);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: result.errors,
          message: 'Error de validación en los datos del formulario.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: result.message
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error en API /api/contact:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Ocurrió un error interno al procesar el mensaje.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
