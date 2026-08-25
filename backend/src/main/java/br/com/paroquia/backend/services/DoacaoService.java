package br.com.paroquia.backend.services;
import br.com.paroquia.backend.entities.Doacao;
import br.com.paroquia.backend.repositories.DoacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoacaoService {
    @Autowired
    private DoacaoRepository doacaoRepository;

    public List<Doacao> todasDoacoes() {
        return doacaoRepository.findAll();
    }

    public Doacao buscarNomeDoacao(String nomeDoacao) {
        return doacaoRepository.findByNomeDoacaoContainingIgnoreCase(nomeDoacao);
    }

    public Doacao buscarIdDoacao(Long idDoacao) {
        return doacaoRepository.findById(idDoacao).orElse(null);
    }

    public void gravarDoacao(Doacao doacaoAux) {
        doacaoRepository.save(doacaoAux);
    }

    public void deletarDoacao(Doacao doacao) {
        doacaoRepository.delete(doacao);
    }
}
