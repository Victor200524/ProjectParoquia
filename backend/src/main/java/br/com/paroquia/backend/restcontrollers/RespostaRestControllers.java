package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Resposta;
import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.enums.UsuarioTipoNivel;
import br.com.paroquia.backend.services.InscricaoAcampamentoService;
import br.com.paroquia.backend.services.RespostaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "resposta")
public class RespostaRestControllers {
    @Autowired
    RespostaService respostaService;

    @Autowired
    InscricaoAcampamentoService inscricaoAcampamentoService;

    @GetMapping(value = "/todasRespostas")
    public ResponseEntity<Object> todasRespostas(){
        List<Resposta> respostaList = respostaService.getAll();
        if(respostaList != null && !respostaList.isEmpty())
            return ResponseEntity.status(HttpStatus.OK).body(respostaList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma resposta cadastrada!");
    }

    @GetMapping(value = "/buscarRespostasPorInscricao/{idInscricao}")
    public ResponseEntity<Object> buscarRespostasPorInscricao(@PathVariable Long idInscricao, @AuthenticationPrincipal Usuario usuarioLogado){
        boolean ehDono = false, ehAdmin = false;
        InscricaoAcampamento inscricao = inscricaoAcampamentoService.buscarInscricao(idInscricao);
        if(inscricao != null){
            if(usuarioLogado.getNivelUsuario() == UsuarioTipoNivel.COORDENADOR_GERAL || usuarioLogado.getNivelUsuario() == UsuarioTipoNivel.PADRE ||
                usuarioLogado.getNivelUsuario() == UsuarioTipoNivel.SECRETARIA || usuarioLogado.getNivelUsuario() == UsuarioTipoNivel.COORDENADOR_ACAMPAMENTO)
                ehAdmin = true;
            ehDono = inscricao.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario());
            if(ehAdmin || ehDono){
                List<Resposta> respostaList = respostaService.getRespostasPorInscricao(inscricao);
                if(respostaList != null && !respostaList.isEmpty())
                    return ResponseEntity.status(HttpStatus.OK).body(respostaList);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma resposta cadastrada para esta inscrição!");
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuario sem permissão para visualizar a resposta!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição não encontrada!");
    }

    @PostMapping(value = "/gravarResposta")
    public ResponseEntity<Object> gravarResposta(@RequestBody Resposta resposta, @AuthenticationPrincipal Usuario usuarioLogado){
        try {
            if(resposta != null){
                Long idInscricao = resposta.getInscricao().getIdInscricao(); // pego o ID da inscrição que veio do JSON
                InscricaoAcampamento inscricao = inscricaoAcampamentoService.buscarInscricao(idInscricao);
                if(inscricao != null){
                    if(inscricao.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())){
                        respostaService.save(resposta);
                        return ResponseEntity.status(HttpStatus.OK).body("Resposta cadastrada com sucesso!");
                    }
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuario sem permissão para responder!");
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição não encontrada!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dados insuficientes para cadastro!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao gravar a Resposta!");
        }
    }

    @PutMapping(value = "/alterarResposta/{id}")
    public ResponseEntity<Object> alterarResposta(@PathVariable Long id, @RequestBody Resposta resposta, @AuthenticationPrincipal Usuario usuarioLogado){
        try {
            Resposta respostaAux = respostaService.getRespostaId(id);
            if(respostaAux != null){
                if(respostaAux.getInscricao().getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())){
                    respostaAux.setTextoResposta(resposta.getTextoResposta());
                    respostaService.save(respostaAux);
                    return ResponseEntity.status(HttpStatus.OK).body("Resposta alterada com sucesso!");
                }
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("O usuario nao tem permissao para alterar esta resposta!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resposta não encontrada!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao alterar a Resposta!");
        }
    }

    @DeleteMapping(value = "/deletarResposta/{id}")
    public ResponseEntity<Object> deletarResposta(@PathVariable Long id){
        Resposta resposta = respostaService.getRespostaId(id);
        if(resposta != null){
            respostaService.deletarResposta(resposta);
            return ResponseEntity.status(HttpStatus.OK).body("Resposta deletada com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resposta não encontrada!");
    }
}
