package br.com.paroquia.backend.mercadopago;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.repositories.InscricaoAcampamentoRepository;
import br.com.paroquia.backend.services.InscricaoAcampamentoService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;

@Component
@Slf4j
public class MercadoPagoClient {

    @Value("${api.v1.mercadopago-accesstoken}")
    private String accessToken;

    @Value("${api.v1.mercadopago-notification-url}")
    private String notificationURL;

    @Autowired
    private InscricaoAcampamentoRepository inscricaoRepository;
    @Autowired
    private InscricaoAcampamentoService inscricaoAcampamentoService;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
        System.out.println("Iniciando SDK do Mercado Pago com sucesso!");
    }

    public PreferenciaResponseDTO createPreference(PreferenciaAcampamentoDTO dto) throws Exception {

        // Busca a inscrição
        InscricaoAcampamento inscricao = inscricaoAcampamentoService.buscarInscricao(dto.idInscricao());
        if(inscricao == null)
            System.out.println("Inscirção não encontrada: " + dto.idInscricao());

        else{
            // Monta o Item puxando os dados reais do acampamento ligado a inscrção que foi buscada
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title(inscricao.getAcampamento().getNomeAcampamento())
                    .quantity(1)
                    .unitPrice(new BigDecimal(inscricao.getAcampamento().getTaxaInscricaoAcampamento().toString()))
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
            Preference preference = client.create(preferenceRequest);

            // Retorna o Objeto DTO que a sua Service está esperando
            return new PreferenciaResponseDTO(preference.getId(), preference.getInitPoint());
        }
        return null;
    }
}