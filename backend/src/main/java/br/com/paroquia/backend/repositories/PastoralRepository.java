package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.Pastoral;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PastoralRepository extends JpaRepository<Pastoral, Long> {
    Pastoral findByNomePastoral(String nomePastoral);
}
