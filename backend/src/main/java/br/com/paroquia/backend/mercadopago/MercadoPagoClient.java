package br.com.paroquia.backend.mercadopago;

import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.enums.TipoFormulario;
import br.com.paroquia.backend.repositories.FormularioRepository;
import br.com.paroquia.backend.repositories.InscricaoAcampamentoRepository;
import br.com.paroquia.backend.services.InscricaoAcampamentoService;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.*;
import com.mercadopago.core.MPRequestOptions;
import com.mercadopago.net.MPResultsResourcesPage;
import com.mercadopago.net.MPSearchRequest;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class MercadoPagoClient {


    @Value("${api.v1.mercadopago-notification-url}")
    private String notificationURL;

    @Autowired
    private InscricaoAcampamentoRepository inscricaoRepository;
    @Autowired
    private InscricaoAcampamentoService inscricaoAcampamentoService;
    @Autowired
    private FormularioRepository formularioRepository;

    public PreferenciaResponseDTO createPreference(PreferenciaAcampamentoDTO dto) throws Exception {

        // Busca a inscrição
        InscricaoAcampamento inscricao = inscricaoAcampamentoService.buscarInscricao(dto.idInscricao());
        if(inscricao == null)
            System.out.println("Inscirção não encontrada: " + dto.idInscricao());

        else{
            String token = inscricao.getAcampamento().getTokenMercadoPagoAcampamento();
            if (token == null || token.isBlank()) {
                throw new IllegalArgumentException("Este acampamento não aceita pagamento online");
            }

            Formulario formulario = formularioRepository.findFirstByAcampamentoIdAcampamentoAndTipoFormulario(inscricao.getAcampamento().getIdAcampamento(), TipoFormulario.valueOf(inscricao.getFuncaoAcampamento()));

            // Monta o Item puxando os dados reais do acampamento ligado a inscrção que foi buscada
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title(inscricao.getAcampamento().getNomeAcampamento())
                    .quantity(1)
                    .unitPrice(BigDecimal.valueOf(formulario.getPrecoFormulario()))
                    .build();

            // Monto as URL's para retornar para o front-end
            PreferenceBackUrlsRequest backUrlsRequest = PreferenceBackUrlsRequest.builder()
                    .success(dto.backUrls().success())
                    .failure(dto.backUrls().failure())
                    .pending(dto.backUrls().pending())
                    .build();

            // Junta tudo em um so requisição para retornar
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(Collections.singletonList(itemRequest))
                    .backUrls(backUrlsRequest)
                    //.autoReturn("approved") Só funciona com URLs reais em produção
                    .externalReference(inscricao.getIdInscricao().toString()) // Fundamental para achar quem pagou depois!
                    .build();

            // Comunica com o serviço do Mercado Pago
            PreferenceClient client = new PreferenceClient();
            MPRequestOptions options = MPRequestOptions.builder().accessToken(token).build();// Pego o token que esta vindo cadastrado la no acampamento
            Preference preference = client.create(preferenceRequest, options);

            // Retorna o Objeto DTO que a sua Service está esperando
            return new PreferenciaResponseDTO(preference.getId(), preference.getInitPoint());
        }
        return null;
    }

    public Payment buscarPagamentoAprovado(InscricaoAcampamento inscricaoAcampamento) throws Exception{
        String token = inscricaoAcampamento.getAcampamento().getTokenMercadoPagoAcampamento();
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Este acampamento não aceita pagamento online");
        }
        MPRequestOptions options = MPRequestOptions.builder().accessToken(token).build();// Pego o token que esta vindo cadastrado la no acampamento
        Map<String, Object> filtros = new HashMap<>();
        filtros.put("external_reference", inscricaoAcampamento.getIdInscricao().toString());
        // Aqui eu faço o filtro de busca no mercado pago
        // limit e offset são obrigatórios na prática: se ficarem nulos, o SDK quebra ao montar a URL (NullPointerException)
        MPSearchRequest busca = MPSearchRequest.builder().filters(filtros).limit(10).offset(0).build();
        PaymentClient paymentClient = new PaymentClient();
        MPResultsResourcesPage<Payment> resultado = paymentClient.search(busca, options);
        return resultado.getResults().stream()
                .filter(pagamento -> "approved".equals(pagamento.getStatus()))
                .findFirst()
                .orElse(null);
    }

    /*
    * 5480 8328 0103 3311
        123
        11/30
        12345678909
        test@testuser.com
        APRO
    * */
}