package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.repositories.InscricaoAcampamentoRepository;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InscricaoAcampamentoService {
    @Autowired
    InscricaoAcampamentoRepository inscricaoRepository;

    public InscricaoAcampamento buscarInscricao(Long idInscricao) {
        return inscricaoRepository.findById(idInscricao).orElse(null);
    }
}
