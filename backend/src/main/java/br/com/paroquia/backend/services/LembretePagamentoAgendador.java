package br.com.paroquia.backend.services;

import br.com.paroquia.backend.dtos.AlertasPagamentoDTO;
import br.com.paroquia.backend.entities.Acampamento;
import br.com.paroquia.backend.repositories.AcampamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// Envio automático dos lembretes de pagamento pendente.
// O Spring chama o método abaixo sozinho, no horário do "cron" (precisa do @EnableScheduling no BackendApplication).
@Component
public class LembretePagamentoAgendador {

    @Autowired
    AcampamentoRepository acampamentoRepository;
    @Autowired
    AlertaPagamentoService alertaPagamentoService;

    // cron = "segundo minuto hora dia mês dia-da-semana" -> "0 0 9 * * *" = todo dia às 9h00
    // (o horário pode ser trocado no application.properties com app.lembrete.cron, útil para testar)
    @Scheduled(cron = "${app.lembrete.cron:0 0 9 * * *}", zone = "America/Sao_Paulo")
    public void enviarLembretesAutomaticos() {
        for (Acampamento acampamento : acampamentoRepository.findByLembreteAtivoAcampamentoTrue()) {
            if (!alertaPagamentoService.deveEnviarHoje(acampamento))
                continue;

            // try/catch por acampamento: um erro num acampamento não impede os outros
            try {
                AlertasPagamentoDTO.ResultadoEnvio resultado = alertaPagamentoService.enviarParaTodos(acampamento.getIdAcampamento());
                System.out.println("[Lembrete automático] " + acampamento.getNomeAcampamento()
                        + ": " + resultado.enviados() + " e-mail(s) enviado(s), " + resultado.falhas().size() + " falha(s)");
                for (String falha : resultado.falhas())
                    System.out.println("[Lembrete automático]   falha -> " + falha);
            } catch (Exception e) {
                System.out.println("[Lembrete automático] Erro no acampamento " + acampamento.getNomeAcampamento() + ": " + e.getMessage());
            }
        }
    }
}
