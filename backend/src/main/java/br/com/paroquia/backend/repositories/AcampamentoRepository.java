package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.Acampamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AcampamentoRepository extends JpaRepository<Acampamento, Long> {
    Optional<Acampamento> findByNomeAcampamento(String nomeAcampamento);
    Acampamento findByNomeAcampamentoContainingIgnoreCase(String nomeAcampamento);
    List<Acampamento> findByComunidade_IdComunidade(Long idComunidade);
}
