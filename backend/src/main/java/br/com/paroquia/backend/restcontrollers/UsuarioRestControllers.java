package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.dtos.AlterarPerfilDTO;
import br.com.paroquia.backend.dtos.PerfilDTO;
import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.enums.UsuarioTipoNivel;
import br.com.paroquia.backend.enums.UsuarioTipoStatus;
import br.com.paroquia.backend.security.TokenService;
import br.com.paroquia.backend.services.InscricaoAcampamentoService;
import br.com.paroquia.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "usuario")
public class UsuarioRestControllers {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private InscricaoAcampamentoService inscricaoAcampamentoService;

    private final PasswordEncoder encoder;

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

    @GetMapping(value = "/validarToken")
    public ResponseEntity<Object> validarToken(){
        return ResponseEntity.ok().build();
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
            String token = tokenService.gerarToken(usuario);
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("token", token);
            resposta.put("idUsuario", usuario.getIdUsuario());
            resposta.put("nomeUsuario", usuario.getNomeUsuario());
            resposta.put("nivelUsuario", usuario.getNivelUsuario());
            return ResponseEntity.ok(resposta);
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta!");
        }
    }

    private String validarUsuario(Usuario usuario){
        // Verifica se ja ta cadastrado no banco (junta as mensagens para avisar o e-mail e o CPF de uma vez)
        String duplicados = "";
        if(usuarioService.getUserEmail(usuario.getEmailUsuario()) != null)
            duplicados += "E-mail já cadastrado! ";
        if(usuarioService.getCpfUsuario(usuario.getCpfUsuario()) != null)
            duplicados += "CPF já cadastrado! ";
        if(!duplicados.isEmpty())
            return duplicados.trim();
        // Verifica se o formato enviado está correto
        if(!usuarioService.isFormatoEmailValido(usuario.getEmailUsuario()))
            return "Formato de E-MAIL inválido: " + usuario.getEmailUsuario();
        if(!usuarioService.isCpfValido(usuario.getCpfUsuario()))
            return "Formato de CPF inválido: " + usuario.getCpfUsuario();
        if(!usuarioService.isTelefoneValido(usuario.getContatoUsuario()))
            return "Formato de telefone inválido: " + usuario.getContatoUsuario();
        return null;
    }

    // ============================== Meu perfil (o próprio usuário logado) ==============================
    // Os dois usam o usuário do token (@AuthenticationPrincipal), nunca um id vindo da tela:
    // assim ninguém consegue ver ou alterar o perfil de outra pessoa.

    @GetMapping(value = "/meuPerfil")
    public ResponseEntity<Object> meuPerfil(@AuthenticationPrincipal Usuario usuarioLogado) {
        Usuario usuario = usuarioService.getUserId(usuarioLogado.getIdUsuario());
        return ResponseEntity.ok(new PerfilDTO(
                usuario.getNomeUsuario(),
                usuario.getEmailUsuario(),
                usuario.getCpfUsuario(),
                usuario.getContatoUsuario(),
                usuario.getEnderecoUsuario(),
                usuario.getDataNascimentoUsuario(),
                usuario.getNivelUsuario().toString(),
                usuario.getFotoUsuario()
        ));
    }

    @PutMapping(value = "/meuPerfil")
    public ResponseEntity<Object> alterarMeuPerfil(@AuthenticationPrincipal Usuario usuarioLogado, @RequestBody AlterarPerfilDTO dados) {
        Usuario usuario = usuarioService.getUserId(usuarioLogado.getIdUsuario());

        // --- validações ---
        if (dados.nome() == null || dados.nome().isBlank())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Informe o nome!");
        if (!usuarioService.isFormatoEmailValido(dados.email()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de E-MAIL inválido: " + dados.email());
        Usuario donoDoEmail = usuarioService.getUserEmail(dados.email());
        if (donoDoEmail != null && !donoDoEmail.getIdUsuario().equals(usuario.getIdUsuario()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("E-mail já cadastrado!");
        if (!usuarioService.isTelefoneValido(dados.contato()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de telefone inválido: " + dados.contato());

        // --- troca de senha (opcional): precisa confirmar a senha atual ---
        if (dados.novaSenha() != null && !dados.novaSenha().isBlank()) {
            if (dados.senhaAtual() == null || !encoder.matches(dados.senhaAtual(), usuario.getSenhaUsuario()))
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Senha atual incorreta!");
            usuario.setSenhaUsuario(encoder.encode(dados.novaSenha()));
        }

        // --- dados que o usuário pode mudar ---
        usuario.setNomeUsuario(dados.nome());
        usuario.setEmailUsuario(dados.email());
        usuario.setContatoUsuario(dados.contato());
        usuario.setEnderecoUsuario(dados.endereco());
        usuario.setDataNascimentoUsuario(dados.dataNascimento());

        // --- foto: remover, trocar ou manter ---
        if (Boolean.TRUE.equals(dados.removerFoto()))
            usuario.setFotoUsuario(null);
        else if (dados.foto() != null)
            usuario.setFotoUsuario(dados.foto());

        usuarioService.alterarUsuario(usuario);
        return ResponseEntity.ok("Perfil atualizado com sucesso!");
    }

    @PostMapping(value = "/cadastrarUsuario")
    public ResponseEntity<Object> cadastrarUsuario(@RequestBody Usuario usuario) {
        try {
            if(usuario != null){
                if(usuario.getNivelUsuario() != UsuarioTipoNivel.CAMPISTA && usuario.getNivelUsuario() != UsuarioTipoNivel.SERVO)
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario nao permitido para cadastro!");

                String erro = validarUsuario(usuario);
                if(erro != null)
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);

                usuario.setSenhaUsuario(encoder.encode(usuario.getSenhaUsuario())); //Aqui faz a criptografia da senha do usuario quando for feito seu cadastro
                usuario.setStatusUsuario(UsuarioTipoStatus.ATIVO);
                Usuario novoUsuario = usuarioService.saveUsuario(usuario);
                return ResponseEntity.status(HttpStatus.CREATED).body("Usuário: " + novoUsuario.getNomeUsuario() + " cadastrado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dados insuficientes para gravar o usuário!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao gravar o Usuário!");
        }
    }

    @PostMapping(value = "/cadastrarUsuarioAdmin")
    public ResponseEntity<Object> cadastrarUsuarioAdmin(@RequestBody Usuario usuario) {
        try {
            if(usuario != null){
                String erro = validarUsuario(usuario);
                if(erro != null)
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);

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

                // A foto não volta para a tela de alteração (WRITE_ONLY); se não veio foto nova, mantém a atual
                if (usuarioAtualizado.getFotoUsuario() == null)
                    usuarioAtualizado.setFotoUsuario(usuarioExistente.getFotoUsuario());

                // guarda o nível antigo antes de salvar: o save copia os dados novos para cima do usuarioExistente
                UsuarioTipoNivel nivelAntigo = usuarioExistente.getNivelUsuario();
                Usuario novoUsuario = usuarioService.alterarUsuario(usuarioAtualizado);
                // Se o nível mudou, as inscrições precisam acompanhar (a inscrição guarda a função como cópia)
                if(nivelAntigo != novoUsuario.getNivelUsuario())
                    inscricaoAcampamentoService.acompanharNivelUsuario(novoUsuario);
                return ResponseEntity.ok("Usuário " + novoUsuario.getNomeUsuario() + " alterado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado para alteração!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao alterar o Usuário!");
        }
    }

    @DeleteMapping(value = "/deletarUsuario/{idUsuario}")
    public ResponseEntity<Object> deletarUsuario(@PathVariable Long idUsuario){
        // Quem está inscrito em algum acampamento não pode ser excluído, senão a inscrição e as respostas dele ficariam sem dono
        List<InscricaoAcampamento> inscricoes = inscricaoAcampamentoService.buscarInscricaoUsuario(idUsuario);
        if(!inscricoes.isEmpty()){
            // monta a lista com o nome dos acampamentos para mostrar o motivo na mensagem
            String acampamentos = "";
            for(InscricaoAcampamento inscricao : inscricoes)
                acampamentos += inscricao.getAcampamento().getNomeAcampamento() + "; ";

            return ResponseEntity.status(HttpStatus.CONFLICT).body("Não é possível excluir: o usuário está inscrito no(s) acampamento(s): "
                    + acampamentos + "Se ele não deve mais usar o sistema, altere o status para INATIVO.");
        }

        if(usuarioService.excluirUsuario(idUsuario))
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Usuário deletado com sucesso");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao deletar o usuário!");
    }
}