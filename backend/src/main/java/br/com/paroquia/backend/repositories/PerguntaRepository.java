package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.entities.Pergunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerguntaRepository extends JpaRepository<Pergunta, Long> {
    List<Pergunta> findByFormulario(Formulario formulario);

    boolean existsByFormulario(Formulario formulario);
}
