package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.MuralFotos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MuralFotosRepository extends JpaRepository<MuralFotos, Long> {
    List<MuralFotos> findByAcampamento_IdAcampamento(Long idAcampamento);

    List<MuralFotos> findByAcampamento_IdAcampamentoOrderByDataEventoMuralFotosDesc(Long idAcampamento);

    List<MuralFotos> findByTituloMuralFotosContainingIgnoreCase(String titulo);
}