package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Pagamento;
import br.com.paroquia.backend.enums.FormaPagamento;
import br.com.paroquia.backend.enums.InscricaoAcampamentoStatus;
import br.com.paroquia.backend.enums.TipoFormulario;
import br.com.paroquia.backend.repositories.FormularioRepository;
import br.com.paroquia.backend.repositories.InscricaoAcampamentoRepository;
import br.com.paroquia.backend.repositories.PagamentoRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PagamentoService {
    @Autowired
    PagamentoRepository pagamentoRepository;
    @Autowired
    FormularioRepository formularioRepository;
    @Autowired
    InscricaoAcampamentoRepository inscricaoAcampamentoRepository;

    public List<Pagamento> listarPagamentos(Long idAcampamento){
        if(idAcampamento == null){
            return pagamentoRepository.findAll();
        }
        return pagamentoRepository.findByInscricaoAcampamento_Acampamento_IdAcampamento(idAcampamento);
    }

    @Transactional
    public Pagamento confirmarPagamento(InscricaoAcampamento inscricaoAcampamento, FormaPagamento formaPagamento, String idMercadoPagoPagamento){
        Formulario formulario = formularioRepository.findFirstByAcampamentoIdAcampamentoAndTipoFormulario(inscricaoAcampamento.getAcampamento().getIdAcampamento(), TipoFormulario.valueOf(inscricaoAcampamento.getFuncaoAcampamento()));
        if (formulario == null || formulario.getPrecoFormulario() == null) {
            throw new IllegalArgumentException("O formulário deste acampamento não tem preço cadastrado!");
        }
        Pagamento pagamento = new Pagamento();
        pagamento.setValorPagamento(formulario.getPrecoFormulario());
        pagamento.setFormaPagamento(formaPagamento);
        pagamento.setDataPagamento(LocalDateTime.now());
        pagamento.setIdMercadoPagoPagamento(idMercadoPagoPagamento);
        pagamento.setInscricaoAcampamento(inscricaoAcampamento);
        inscricaoAcampamento.setStatusAprovacao(InscricaoAcampamentoStatus.CONFIRMADO);
        inscricaoAcampamentoRepository.save(inscricaoAcampamento);
        return pagamentoRepository.save(pagamento);
    }

}
