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

    public Pastoral getIdPastoral(Long id){
        return pastoralRepository.findById(id).orElse(null);
    }

    public Pastoral getNamePastoral(String nomePastoral) {
        return pastoralRepository.findByNomePastoral(nomePastoral);
    }

    public void salvarPastoral(Pastoral pastoral) {
        try{
            pastoralRepository.save(pastoral);
        }catch (Exception e){
            System.out.println("Erro ao gravar usuário: " + e.getMessage());
        }
    }
}
