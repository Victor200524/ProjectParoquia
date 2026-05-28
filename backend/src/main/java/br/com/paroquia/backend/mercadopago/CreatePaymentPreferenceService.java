package br.com.paroquia.backend.mercadopago;

import com.mercadopago.exceptions.MPApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CreatePaymentPreferenceService {

    private final MercadoPagoClient mercadoPagoClient;

    public CreatePaymentPreferenceService(MercadoPagoClient mercadoPagoClient) {
        this.mercadoPagoClient = mercadoPagoClient;
    }

    public PreferenciaResponseDTO createPreferencePayment(PreferenciaAcampamentoDTO inputData) {
        System.out.println("Iniciando requisição de pagamento para a inscrição ID: " + inputData.idInscricao());

        if (inputData.idInscricao() == null)
            throw new IllegalArgumentException("O ID da inscrição é obrigatório.");
        if (inputData.backUrls() == null)
            throw new IllegalArgumentException("As URLs de retorno são obrigatórias.");

        try {
            PreferenciaResponseDTO responseDTO = mercadoPagoClient.createPreference(inputData);
            System.out.println("Preferência criada com sucesso -> ID: " + responseDTO.preferenceId());
            return responseDTO;
        } catch (IllegalArgumentException e) {
            System.out.println("Erro de validação: " + e.getMessage());
            throw e;
        } catch (MPApiException apiException) {
            System.out.println("O Mercado Pago recusou os dados: " + apiException.getApiResponse().getContent());
            throw new RuntimeException("Erro na API do Mercado Pago", apiException);
        } catch (Exception e) {
            System.out.println("Erro interno ao criar preferência de pagamento: " + e.getMessage());
            throw new RuntimeException("Erro ao processar o pagamento com o Mercado Pago", e);
        }
    }
}