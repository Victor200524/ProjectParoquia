package br.com.paroquia.backend.mercadopago;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO responsável por receber o pedido de pagamento vindo do Front-end
 * Recebe APENAS o ID da inscrição e as URLs de retorno para garantir a segurança,
 * impedindo que o usuário ou hackers alterem o valor real do acampamento pela tela
 */
public record PreferenciaAcampamentoDTO(
        @NotNull(message = "O ID da inscrição não pode ser nulo")
        Long idInscricao,
        @NotNull(message = "As URLs de retorno não podem ser nulas")
        @Valid
        BackUrlsDTO backUrls

) {
    public record BackUrlsDTO(
            @NotBlank(message = "URL de sucesso é obrigatória")
            String success,

            @NotBlank(message = "URL de falha é obrigatória")
            String failure,

            @NotBlank(message = "URL de pagamento pendente é obrigatória")
            String pending
    ) {}
}