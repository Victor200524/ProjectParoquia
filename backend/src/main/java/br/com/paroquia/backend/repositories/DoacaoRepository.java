package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.Doacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoacaoRepository extends JpaRepository<Doacao, Long> {
    Doacao findByNomeDoacaoContainingIgnoreCase(String nomeDoador);
}
