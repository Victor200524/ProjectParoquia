package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.enums.TipoFormulario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormularioRepository extends JpaRepository<Formulario, Long> {
    List<Formulario> findByTituloFormularioContainingIgnoreCase(String tituloFormulario);
    Formulario findFirstByAcampamentoIdAcampamentoAndTipoFormulario(Long idAcampamento, TipoFormulario tipoFormulario);

}
