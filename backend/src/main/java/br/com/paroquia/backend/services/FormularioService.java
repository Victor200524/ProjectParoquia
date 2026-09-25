package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.repositories.FormularioRepository;
import br.com.paroquia.backend.repositories.PerguntaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormularioService {
    @Autowired
    private FormularioRepository formularioRepository;

    @Autowired
    private PerguntaRepository perguntaRepository;

    public List<Formulario> getAll() {
        return formularioRepository.findAll();
    }

    public List<Formulario> getFormulario(String titulo) {
        return formularioRepository.findByTituloFormularioContainingIgnoreCase(titulo);
    }

    public Formulario getFormularioId(Long id){
        return formularioRepository.findById(id).orElse(null);
    }

    public Formulario save(Formulario formulario) {
        return formularioRepository.save(formulario);
    }

    public boolean deletarFormulario(Formulario formulario) {
        if (perguntaRepository.existsByFormulario(formulario)) {
            return false;
        }
        formularioRepository.delete(formulario);
        return true;
    }
}
