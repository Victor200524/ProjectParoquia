package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Pagamento;
import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.enums.FormaPagamento;
import br.com.paroquia.backend.enums.InscricaoAcampamentoStatus;
import br.com.paroquia.backend.enums.UsuarioTipoNivel;
import br.com.paroquia.backend.mercadopago.CreatePaymentPreferenceService;
import br.com.paroquia.backend.mercadopago.MercadoPagoClient;
import br.com.paroquia.backend.mercadopago.PreferenciaAcampamentoDTO;
import br.com.paroquia.backend.mercadopago.PreferenciaResponseDTO;
import br.com.paroquia.backend.services.InscricaoAcampamentoService;
import br.com.paroquia.backend.services.PagamentoService;
import com.mercadopago.resources.payment.Payment;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/pagamento")
@Slf4j
public class PagamentoRestControllers {

    @Autowired
    PagamentoService pagamentoService;
    @Autowired
    InscricaoAcampamentoService inscricaoAcampamentoService;
    @Autowired
    MercadoPagoClient mercadoPagoClient;

    @GetMapping(value = "/listarPagamentos")
    public ResponseEntity<Object> listarPagamentos(@RequestParam(required = false) Long idAcampamento){
        return ResponseEntity.ok(pagamentoService.listarPagamentos(idAcampamento));
    }


    @PostMapping(value = "/registrarPagamentoManual/{idInscricao}")
    public ResponseEntity<Object> registrarPagamentoManual(@PathVariable Long idInscricao, @RequestParam FormaPagamento formaPagamento){
        InscricaoAcampamento inscricao = inscricaoAcampamentoService.buscarInscricao(idInscricao);
        if (inscricao == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição não encontrada!");
        }
        if (formaPagamento == FormaPagamento.MERCADO_PAGO) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Pagamento pelo Mercado Pago não pode ser registrado manualmente!");
        }
        if (inscricao.getStatusAprovacao() != InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esta inscrição não está aguardando pagamento!");
        }

        try {
            Pagamento pagamento = pagamentoService.confirmarPagamento(inscricao, formaPagamento, null);
            return ResponseEntity.status(HttpStatus.CREATED).body(pagamento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/verificarPagamento/{idInscricao}")
    public ResponseEntity<Object> verificarPagamento(@PathVariable Long idInscricao, @AuthenticationPrincipal Usuario usuarioLogado){
        InscricaoAcampamento inscricao = inscricaoAcampamentoService.buscarInscricao(idInscricao);
        if (inscricao == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição não encontrada!");
        }
        boolean ehDono = inscricao.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario());
        boolean ehEquipe = usuarioLogado.getNivelUsuario() != UsuarioTipoNivel.CAMPISTA
                && usuarioLogado.getNivelUsuario() != UsuarioTipoNivel.SERVO;
        if (!ehDono && !ehEquipe) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não pode verificar esta inscrição!");
        }

        if (inscricao.getStatusAprovacao() != InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esta inscrição não está aguardando pagamento!");
        }

        try {
            Payment pagamentoMp = mercadoPagoClient.buscarPagamentoAprovado(inscricao);
            if (pagamentoMp == null) {
                return ResponseEntity.ok("Pagamento ainda não aprovado pelo Mercado Pago.");
            }
            Pagamento pagamento = pagamentoService.confirmarPagamento(inscricao, FormaPagamento.MERCADO_PAGO, pagamentoMp.getId().toString());
            return ResponseEntity.status(HttpStatus.CREATED).body(pagamento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Erro ao verificar o pagamento da inscrição {}", idInscricao, e); // mostra o erro real no console do backend
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao consultar o Mercado Pago.");
        }
    }

    // =========================================== RELACIONADO AO MERCADO PAGO =========================================

    @Autowired
    private CreatePaymentPreferenceService createPaymentPreferenceService;

    @PostMapping(value = "/criarPreferencia")
    public ResponseEntity<Object> criarPreferencia(@Valid @RequestBody PreferenciaAcampamentoDTO request, @AuthenticationPrincipal Usuario usuarioLogado) {
        InscricaoAcampamento inscricao = inscricaoAcampamentoService.buscarInscricao(request.idInscricao());
        if (inscricao == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição não encontrada!");
        }
        if (!inscricao.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você só pode pagar a sua própria inscrição!");
        }
        if (inscricao.getStatusAprovacao() != InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esta inscrição não está aguardando pagamento!");
        }
        try {
            PreferenciaResponseDTO responseDTO = createPaymentPreferenceService.createPreferencePayment(request);
            return ResponseEntity.ok(responseDTO);

        } catch (IllegalArgumentException e) {
            System.out.println("Dados inválidos na requisição: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Erro crítico ao criar preferência de pagamento: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao gerar o pagamento com o Mercado Pago");
        }
    }

    // =========================================== RELACIONADO AO MERCADO PAGO =========================================

}