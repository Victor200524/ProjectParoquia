package br.com.paroquia.backend.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record AlertasPagamentoDTO(
        Long idAcampamento,
        String nomeAcampamento,
        LocalDate dataInicioAcampamento,
        long diasParaAcampamento,      // negativo = o acampamento já começou
        boolean emailConfigurado,
        boolean aceitaPagamentoOnline, // true = acampamento tem Mercado Pago (o e-mail mostra "Pagar online")
        double totalPendente,          // soma do que falta receber
        List<Pendente> pendentes,

        // Programação do envio automático
        boolean lembreteAtivo,
        Integer lembreteIntervaloDias,
        LocalDate lembreteUltimoEnvio,
        LocalDate proximoEnvio         // null = não vai ter próximo envio (desligado ou acampamento já começou)
) {
    public record Pendente(
            Long idInscricao,
            String nomeUsuario,
            String emailUsuario,
            String contatoUsuario,
            String funcao,             // CAMPISTA ou SERVO
            Double valor,              // null = formulário sem preço informado
            LocalDateTime dataInscricao,
            long diasDesdeInscricao
    ) {
    }

    // Resposta do "Enviar e-mail para todos"
    public record ResultadoEnvio(int enviados, List<String> falhas) {
    }

    // O que a tela manda para salvar a programação
    public record Programacao(Boolean ativo, Integer intervaloDias) {
    }
}
