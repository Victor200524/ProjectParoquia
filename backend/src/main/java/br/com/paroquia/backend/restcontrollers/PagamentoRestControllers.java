package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.mercadopago.CreatePaymentPreferenceService;
import br.com.paroquia.backend.mercadopago.PreferenciaAcampamentoDTO;
import br.com.paroquia.backend.mercadopago.PreferenciaResponseDTO;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/pagamento")
@Slf4j
public class PagamentoRestControllers {

    // =========================================== RELACIONADO AO MERCADO PAGO =========================================

    @Autowired
    private CreatePaymentPreferenceService createPaymentPreferenceService;

    @PostMapping(value = "/criarPreferencia")
    public ResponseEntity<Object> criarPreferencia(@Valid @RequestBody PreferenciaAcampamentoDTO request) {
        System.out.println("Recebendo requisição para gerar link de pagamento da inscrição ID: " + request.idInscricao());

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