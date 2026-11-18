package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.dtos.AlertasPagamentoDTO;
import br.com.paroquia.backend.services.AlertaPagamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/alertaPagamento")
public class AlertaPagamentoRestControllers {

    @Autowired
    private AlertaPagamentoService alertaPagamentoService;

    // Lista as inscrições com pagamento pendente de um acampamento (ADMIN e COORDENADOR, ver SecurityConfig)
    @GetMapping(value = "/{idAcampamento}")
    public ResponseEntity<Object> listarPendentes(@PathVariable Long idAcampamento) {
        AlertasPagamentoDTO alertas = alertaPagamentoService.listarPendentes(idAcampamento);
        if (alertas == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Acampamento não encontrado.");
        return ResponseEntity.ok(alertas);
    }

    // Envia o e-mail de cobrança para uma inscrição
    @PostMapping(value = "/enviar/{idInscricao}")
    public ResponseEntity<Object> enviarParaUm(@PathVariable Long idInscricao) {
        try {
            return ResponseEntity.ok(alertaPagamentoService.enviarParaUm(idInscricao));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (MailException e) {
            System.out.println("Erro ao enviar e-mail: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("O servidor de e-mail recusou o envio. Confira o e-mail e a senha de app no application.properties.");
        }
    }

    // Envia o e-mail para todos os pendentes do acampamento
    @PostMapping(value = "/enviarTodos/{idAcampamento}")
    public ResponseEntity<Object> enviarParaTodos(@PathVariable Long idAcampamento) {
        try {
            return ResponseEntity.ok(alertaPagamentoService.enviarParaTodos(idAcampamento));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Liga/desliga o envio automático e define de quantos em quantos dias
    @PutMapping(value = "/programacao/{idAcampamento}")
    public ResponseEntity<Object> salvarProgramacao(@PathVariable Long idAcampamento, @RequestBody AlertasPagamentoDTO.Programacao programacao) {
        try {
            alertaPagamentoService.salvarProgramacao(idAcampamento, programacao);
            return ResponseEntity.ok("Programação salva!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
