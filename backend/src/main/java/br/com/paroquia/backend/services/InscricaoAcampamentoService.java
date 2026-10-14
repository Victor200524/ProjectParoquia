package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.repositories.InscricaoAcampamentoRepository;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InscricaoAcampamentoService {
    @Autowired
    InscricaoAcampamentoRepository inscricaoRepository;

    public InscricaoAcampamento buscarInscricao(Long idInscricao) {
        return inscricaoRepository.findById(idInscricao).orElse(null);
    }

    public List<InscricaoAcampamento> buscarInscricaoNome(String nome){
        return inscricaoRepository.findByUsuarioNomeUsuarioContainingIgnoreCase(nome);
    }

    public InscricaoAcampamento buscarInscricaoUsuarioAcampamento(Long idUsuario, Long idAcampamento){
        return inscricaoRepository.findByUsuarioIdUsuarioAndAcampamentoIdAcampamento(idUsuario, idAcampamento);
    }

    public List<InscricaoAcampamento> getAllInscricao(){
        return inscricaoRepository.findAll();
    }

    public void save(InscricaoAcampamento inscricao) {
        inscricaoRepository.save(inscricao);
    }

    public void deletarInscricao(InscricaoAcampamento inscricaoAcampamento) {
        inscricaoRepository.delete(inscricaoAcampamento);
    }
}
