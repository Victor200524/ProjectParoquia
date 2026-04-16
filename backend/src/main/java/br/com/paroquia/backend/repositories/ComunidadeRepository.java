package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.Comunidade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComunidadeRepository extends JpaRepository<Comunidade, Long> {
    Comunidade findByNomeComunidade(String nomeComunidade);
}
