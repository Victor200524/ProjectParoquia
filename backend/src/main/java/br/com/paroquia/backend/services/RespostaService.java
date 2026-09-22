package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Resposta;
import br.com.paroquia.backend.repositories.RespostaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RespostaService {
    @Autowired
    private RespostaRepository respostaRepository;

    public List<Resposta> getAll() {
        return respostaRepository.findAll();
    }

    public List<Resposta> getRespostasPorInscricao(InscricaoAcampamento inscricao) {
        return respostaRepository.findByInscricao(inscricao);
    }

    public Resposta getRespostaId(Long id){
        return respostaRepository.findById(id).orElse(null);
    }

    public void save(Resposta resposta) {
        respostaRepository.save(resposta);
    }

    public void deletarResposta(Resposta resposta) {
        respostaRepository.delete(resposta);
    }
}
