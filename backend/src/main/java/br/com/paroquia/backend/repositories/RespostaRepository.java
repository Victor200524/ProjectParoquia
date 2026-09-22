package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Pergunta;
import br.com.paroquia.backend.entities.Resposta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RespostaRepository extends JpaRepository<Resposta, Long> {
    List<Resposta> findByInscricao(InscricaoAcampamento inscricao);

    boolean existsByPergunta(Pergunta pergunta);
}
