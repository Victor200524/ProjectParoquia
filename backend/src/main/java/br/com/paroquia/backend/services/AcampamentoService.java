package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Acampamento;
import br.com.paroquia.backend.repositories.AcampamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcampamentoService {
    @Autowired
    AcampamentoRepository acampamentoRepository;

    public List<Acampamento> getAllAcampamentos() {
        return acampamentoRepository.findAll();
    }

    public Acampamento getAcampamentoById(Long idAcampamento) {
        return acampamentoRepository.findById(idAcampamento).orElse(null);
    }

    public Acampamento getNomeAcampamento(String nome){
        return acampamentoRepository.findByNomeAcampamentoContainingIgnoreCase(nome);
    }

    public Acampamento saveAcampamento(Acampamento acampamento) {
        if (acampamento.getIdadeMinAcampamento() >= acampamento.getIdadeMaxAcampamento())
            throw new IllegalArgumentException("A idade mínima deve ser menor que a idade máxima do acampamento!");

        if (acampamento.getDataInicioAcampamento() != null && acampamento.getDataFimAcampamento() != null)
            if (acampamento.getDataInicioAcampamento().after(acampamento.getDataFimAcampamento()))
                throw new IllegalArgumentException("A data de início não pode ser depois da data de término!");

        if (acampamento.getVagasAcampamento() < 0)
            acampamento.setVagasAcampamento(0); // Uma forma de garantir que nunca vai ser negativo
        return acampamentoRepository.save(acampamento);
    }

    public boolean excluirAcampamento(Long idAcampamento) {
        try {
            if (acampamentoRepository.existsById(idAcampamento)) {
                acampamentoRepository.deleteById(idAcampamento);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Erro ao deletar acampamento: " + e.getMessage());
            return false;
        }
    }

}
