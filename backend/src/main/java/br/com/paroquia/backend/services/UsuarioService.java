package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getAllUsers(){
        return usuarioRepository.findAll();
    }

    // Faz parte do login e da busca do usuário através do email
    public Usuario getUserEmail(String email) {
        return usuarioRepository.findByEmailUsuario(email);
    }
    // Serve somente para o login
    public boolean verificarLogin(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmailUsuario(email);
        return usuario != null && usuario.getSenhaUsuario().equals(senha);
    }

    public Usuario getUserId(Long idUsuario){
        return usuarioRepository.findById(idUsuario).orElse(null);
    }

    public Usuario saveUsuario(Usuario usuario) {
        try{
            Usuario novoUsuario = usuarioRepository.save(usuario);
            return usuario;
        }catch (Exception e){
            return null;
        }
    }

    public boolean excluirUsuario(Long idUsuario) {
        try{
            usuarioRepository.deleteById(idUsuario);
            return true;
        } catch (Exception e) {
            System.err.println("Erro ao deletar: " + e.getMessage());
        }
        return false;
    }

}
