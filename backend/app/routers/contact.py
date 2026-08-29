from fastapi import APIRouter, HTTPException, status

from app.schemas.contact import ContactRequest, ContactResponse

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactResponse)
async def send_contact_message(data: ContactRequest):
    if not data.name.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="El nombre es requerido",
        )
    if len(data.message.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="El mensaje debe tener al menos 10 caracteres",
        )

    # TODO: Integrar con servicio de email (Web3Forms, SendGrid, etc.)
    # Por ahora retorna éxito simulado
    return ContactResponse(
        success=True,
        message="¡Mensaje recibido con éxito! Me pondré en contacto contigo pronto.",
    )
