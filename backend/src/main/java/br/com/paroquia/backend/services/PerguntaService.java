package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.entities.Pergunta;
import br.com.paroquia.backend.repositories.PerguntaRepository;
import br.com.paroquia.backend.repositories.RespostaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerguntaService {
    @Autowired
    private PerguntaRepository perguntaRepository;

    @Autowired
    private RespostaRepository respostaRepository;

    public List<Pergunta> getAll() {
        return perguntaRepository.findAll();
    }

    public List<Pergunta> getPerguntasPorFormulario(Formulario formulario) {
        return perguntaRepository.findByFormulario(formulario);
    }

    public Pergunta getPerguntaId(Long id){
        return perguntaRepository.findById(id).orElse(null);
    }

    public void save(Pergunta pergunta) {
        perguntaRepository.save(pergunta);
    }

    public boolean deletarPergunta(Pergunta pergunta) {
        if (respostaRepository.existsByPergunta(pergunta)) {
            return false;
        }
        perguntaRepository.delete(pergunta);
        return true;
    }
}
