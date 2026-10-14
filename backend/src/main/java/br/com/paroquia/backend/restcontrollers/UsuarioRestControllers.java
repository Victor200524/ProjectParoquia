package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.enums.UsuarioTipoStatus;
import br.com.paroquia.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping(value = "usuario")
public class UsuarioRestControllers {
    @Autowired
    private UsuarioService usuarioService;

    private final PasswordEncoder encoder;

    // Código gerado toda vez que o servidor liga. Ele vira o token do login, então quando o servidor
    // reinicia o código muda e o front percebe que o token antigo não vale mais (desloga o usuário)
    private static final String SESSAO_SERVIDOR = UUID.randomUUID().toString();

    public UsuarioRestControllers(PasswordEncoder encoder) {
        this.encoder = encoder;
    }

    @GetMapping(value = "/getAllUsers")
    public ResponseEntity<Object> getAllUsers(){
        List<Usuario> usuarioList = usuarioService.getAllUsarios();
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

    @GetMapping(value = "/sessaoServidor")
    public ResponseEntity<Object> sessaoServidor(){
        return ResponseEntity.ok(SESSAO_SERVIDOR);
    }

    public record LoginDTO(String cpf, String senha) {}
    @PostMapping(value = "/loginUsuario")
    public ResponseEntity<Object> loginUsuario(@RequestBody LoginDTO loginDto) {
        Optional<Usuario> optionalUsuario = Optional.ofNullable(usuarioService.getCpfUsuario(loginDto.cpf()));

        if (optionalUsuario.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autorizado!");

        Usuario usuario = optionalUsuario.get();

        // Usuário inativo não pode entrar no sistema
        if (usuario.getStatusUsuario() == UsuarioTipoStatus.INATIVO)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário inativo! Procure a coordenação.");

        boolean validar = encoder.matches(loginDto.senha(), usuario.getSenhaUsuario());

        if (validar) {
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("token", SESSAO_SERVIDOR);
            resposta.put("idUsuario", usuario.getIdUsuario());
            resposta.put("nomeUsuario", usuario.getNomeUsuario());
            resposta.put("nivelUsuario", usuario.getNivelUsuario());
            return ResponseEntity.ok(resposta);
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta!");
        }
    }

    @PostMapping(value = "/cadastrarUsuario")
    public ResponseEntity<Object> cadastrarUsuario(@RequestBody Usuario usuario) {
        try {
            if(usuario != null){
                // Verifica se ja ta cadastrado no banco (junta as mensagens para avisar o e-mail e o CPF de uma vez)
                String duplicados = "";
                if(usuarioService.getUserEmail(usuario.getEmailUsuario()) != null)
                    duplicados += "E-mail já cadastrado! ";
                if(usuarioService.getCpfUsuario(usuario.getCpfUsuario()) != null)
                    duplicados += "CPF já cadastrado! ";
                if(!duplicados.isEmpty())
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(duplicados.trim());
                // Verifica se o formato enviado está correto
                if(!usuarioService.isFormatoEmailValido(usuario.getEmailUsuario()))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de E-MAIL inválido: " + usuario.getEmailUsuario());
                if(!usuarioService.isCpfValido(usuario.getCpfUsuario()))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de CPF inválido: " + usuario.getCpfUsuario());
                if(!usuarioService.isTelefoneValido(usuario.getContatoUsuario()))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de telefone inválido: " + usuario.getContatoUsuario());

                usuario.setSenhaUsuario(encoder.encode(usuario.getSenhaUsuario())); //Aqui faz a criptografia da senha do usuario quando for feito seu cadastro
                Usuario novoUsuario = usuarioService.saveUsuario(usuario);
                return ResponseEntity.status(HttpStatus.CREATED).body("Usuário: " + novoUsuario.getNomeUsuario() + " cadastrado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dados insuficientes para gravar o usuário!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao gravar o Usuário!");
        }
    }

    @PutMapping(value = "/alterarUsuario/{idUsuario}")
    public ResponseEntity<Object> alterarUsuario(@PathVariable Long idUsuario, @RequestBody Usuario usuarioAtualizado) {
        try {
            Usuario usuarioExistente = usuarioService.getUserId(idUsuario);

            if (usuarioExistente != null) {
                usuarioAtualizado.setIdUsuario(usuarioExistente.getIdUsuario());

                // Verifica se o e-mail/CPF ja pertence a OUTRO usuario (o proprio usuario pode manter os dele)
                // (junta as mensagens para avisar o e-mail e o CPF de uma vez)
                String duplicados = "";
                Usuario usuarioEmail = usuarioService.getUserEmail(usuarioAtualizado.getEmailUsuario());
                if(usuarioEmail != null && !usuarioEmail.getIdUsuario().equals(idUsuario))
                    duplicados += "E-mail já cadastrado! ";
                Usuario usuarioCpf = usuarioService.getCpfUsuario(usuarioAtualizado.getCpfUsuario());
                if(usuarioCpf != null && !usuarioCpf.getIdUsuario().equals(idUsuario))
                    duplicados += "CPF já cadastrado! ";
                if(!duplicados.isEmpty())
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(duplicados.trim());
                // Verifica se o formato enviado está correto
                if(!usuarioService.isFormatoEmailValido(usuarioAtualizado.getEmailUsuario()))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de E-MAIL inválido: " + usuarioAtualizado.getEmailUsuario());
                if(!usuarioService.isCpfValido(usuarioAtualizado.getCpfUsuario()))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de CPF inválido: " + usuarioAtualizado.getCpfUsuario());
                if(!usuarioService.isTelefoneValido(usuarioAtualizado.getContatoUsuario()))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de telefone inválido: " + usuarioAtualizado.getContatoUsuario());

                // Se não mandou senha nova, mantém a antiga, ja criptografada no banco
                if (usuarioAtualizado.getSenhaUsuario() == null || usuarioAtualizado.getSenhaUsuario().isEmpty())
                    usuarioAtualizado.setSenhaUsuario(usuarioExistente.getSenhaUsuario());
                else
                    usuarioAtualizado.setSenhaUsuario(encoder.encode(usuarioAtualizado.getSenhaUsuario()));

                Usuario novoUsuario = usuarioService.alterarUsuario(usuarioAtualizado);
                return ResponseEntity.ok("Usuário " + novoUsuario.getNomeUsuario() + " alterado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado para alteração!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao alterar o Usuário!");
        }
    }

    @DeleteMapping(value = "/deletarUsuario/{idUsuario}")
    public ResponseEntity<Object> deletarUsuario(@PathVariable Long idUsuario){
        if(usuarioService.excluirUsuario(idUsuario))
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Usuário deletado com sucesso");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao deletar o usuário!");
    }
}