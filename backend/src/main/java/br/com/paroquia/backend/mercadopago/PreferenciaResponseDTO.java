package br.com.paroquia.backend.mercadopago;

/**
 * DTO responsável por enviar a resposta do Back-end de volta para o Front-end
 * Ele devolve o link exato (redirectUrl) onde o fiel será redirecionado para
 * pagar no Mercado Pago, junto com o ID gerado para a transação
 */

public record PreferenciaResponseDTO(
        String preferenceId,
        String redirectUrl
) {}
