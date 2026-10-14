package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InscricaoAcampamentoRepository extends JpaRepository<InscricaoAcampamento, Long> {
    List<InscricaoAcampamento> findByUsuarioNomeUsuarioContainingIgnoreCase(String nomeUsuario);
    InscricaoAcampamento findByUsuarioIdUsuarioAndAcampamentoIdAcampamento(Long idUsuario, Long idAcampamento);
}
