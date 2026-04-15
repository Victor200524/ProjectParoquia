package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "usuario")
public class UsuarioRestController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping(value = "/getAllUsers")
    public ResponseEntity<Object> getAllUsers(){
        List<Usuario> usuarioList = usuarioService.getAllUsers();
        if(usuarioList != null)
            return ResponseEntity.ok(usuarioList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuários não cadastrados");
    }

    @GetMapping(value = "/buscarUsuario/{emailUsuario}")
    public ResponseEntity<Object> getUserEmail(@PathVariable String emailUsuario){
        Usuario usuario = usuarioService.getUserEmail(emailUsuario);
        if (usuario != null)
            return ResponseEntity.ok(usuario);
        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email: " + emailUsuario + " não encontrado!");
    }

    @GetMapping(value = "/loginUsuario")
    public ResponseEntity<Object> loginUsuario(@RequestBody Usuario usuario){
        if(usuarioService.getUserEmail(usuario.getEmailUsuario()) != null){
            if(usuarioService.verificarLogin(usuario.getEmailUsuario(), usuario.getSenhaUsuario()))
                return ResponseEntity.status(HttpStatus.ACCEPTED).body("Login efetuado com sucesso");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Senha incorreta!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email incorreto!");
    }

    @PostMapping(value = "/gravarUsuario")
    public ResponseEntity<Object> gravarUsuario(@RequestBody Usuario usuario) {
        if(usuario != null){
            if(usuarioService.getUserEmail(usuario.getEmailUsuario()) == null){
                Usuario novoUsuario = usuarioService.saveUsuario(usuario);
                return ResponseEntity.status(HttpStatus.CREATED).body("Usuário: " + usuario.getNomeUsuario() + " cadastrado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuário ja cadastrado com esse e-mail: " + usuario.getEmailUsuario());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dados insuficientes para gravar o usuário!");
    }
    
    @PutMapping(value = "/alterarUsuario/{idUsuario}")
    public ResponseEntity<Object> alterarUsuario(@PathVariable Long idUsuario, @RequestBody Usuario usuarioAtualizado) {
        Usuario usuarioExistente = usuarioService.getUserId(idUsuario);

        if (usuarioExistente != null) {
            usuarioAtualizado.setIdUsuario(usuarioExistente.getIdUsuario());
            if (usuarioAtualizado.getSenhaUsuario() == null)
                usuarioAtualizado.setSenhaUsuario(usuarioExistente.getSenhaUsuario());
            Usuario novoUsuario = usuarioService.saveUsuario(usuarioAtualizado);
            return ResponseEntity.ok(novoUsuario);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado para alteração!");
    }

    @DeleteMapping(value = "/deletarUsuario/{idUsuario}")
    public ResponseEntity<Object> deletarUsuario(@PathVariable Long idUsuario){
        if(usuarioService.deletarUsuario(idUsuario))
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Usuário deletado com sucesso");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao deletar o usuário!");
    }
}
