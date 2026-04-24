package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmailUsuario(String emailUsuario);
    Usuario findBySenhaUsuario(String senha);
    Usuario findByCpfUsuario(String cpf);
    Usuario findByContatoUsuario(String contato);
}
