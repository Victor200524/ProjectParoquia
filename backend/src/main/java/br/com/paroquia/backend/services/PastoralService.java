package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Pastoral;
import br.com.paroquia.backend.repositories.PastoralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PastoralService{
    @Autowired
    PastoralRepository pastoralRepository;

    public List<Pastoral> getAllPastoral() {
        return pastoralRepository.findAll();
    }

    public Pastoral getNamePastoral(String nomePastoral) {
        return pastoralRepository.findByNomePastoral(nomePastoral);
    }
}
