package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Acampamento;
import br.com.paroquia.backend.entities.MuralFotos;
import br.com.paroquia.backend.repositories.MuralFotosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MuralFotosService {

    @Autowired
    private MuralFotosRepository muralFotosRepository;
    @Autowired
    private AcampamentoService acampamentoService;

    public List<MuralFotos> getAllMurais() {
        return muralFotosRepository.findAll();
    }

    public MuralFotos getMuralById(Long idMuralFotos) {
        return muralFotosRepository.findById(idMuralFotos).orElse(null);
    }

    public List<MuralFotos> getMuraisDoAcampamento(Long idAcampamento) {
        return muralFotosRepository.findByAcampamento_IdAcampamentoOrderByDataEventoMuralFotosDesc(idAcampamento); // Ja trás ordenado por data
    }

    public MuralFotos saveMural(MuralFotos mural) {
        if (mural.getTituloMuralFotos() == null || mural.getTituloMuralFotos().trim().isEmpty())
            throw new IllegalArgumentException("O título do mural não pode estar vazio!");

        if (mural.getLinkDriveMuralFotos() == null || mural.getLinkDriveMuralFotos().trim().isEmpty())
            throw new IllegalArgumentException("O link do Google Drive é obrigatório!");

        if (mural.getDataEventoMuralFotos() == null)
            throw new IllegalArgumentException("A data do evento é obrigatória!");

        if (mural.getAcampamento() == null || mural.getAcampamento().getIdAcampamento() == null)
            throw new IllegalArgumentException("O mural deve estar vinculado a um acampamento!");

        Acampamento acampamentoExistente = acampamentoService.getAcampamentoById(mural.getAcampamento().getIdAcampamento());
        if (acampamentoExistente == null)
            throw new IllegalArgumentException("O acampamento informado não existe no sistema!");

        mural.setAcampamento(acampamentoExistente);
        return muralFotosRepository.save(mural);
    }


    public boolean excluirMural(Long idMuralFotos) {
        try {
            if (muralFotosRepository.existsById(idMuralFotos)) {
                muralFotosRepository.deleteById(idMuralFotos);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Erro ao deletar mural de fotos: " + e.getMessage());
            return false;
        }
    }
}