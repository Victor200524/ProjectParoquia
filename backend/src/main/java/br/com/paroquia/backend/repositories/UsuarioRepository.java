package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmailUsuario(String emailUsuario);
    Optional<Usuario> findByCpfUsuario(String cpfUsuario);
}
