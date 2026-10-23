package br.com.paroquia.backend.restcontrollers;


import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.enums.InscricaoAcampamentoStatus;
import br.com.paroquia.backend.enums.TipoFormulario;
import br.com.paroquia.backend.services.FormularioService;
import br.com.paroquia.backend.services.InscricaoAcampamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/inscricaoAcampamento")
public class InscricaoAcampamentoRestControllers {
    @Autowired
    InscricaoAcampamentoService inscricaoAcampamentoService;

    @Autowired
    FormularioService formularioService;

    @GetMapping(value = "/todasInscricoes")
    public ResponseEntity<Object> buscarInscricao(){
        List<InscricaoAcampamento> inscricaoAcampamentoList = inscricaoAcampamentoService.getAllInscricao();
        return inscricaoAcampamentoList!=null ? ResponseEntity.status(HttpStatus.OK).body(inscricaoAcampamentoList) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma inscrição feita!");
    }

    @GetMapping(value = "/buscarInscricaoNome/{nome}")
    public ResponseEntity<Object> buscarInscricaoNome(@PathVariable String nome){
        List<InscricaoAcampamento> inscricaoAcampamento = inscricaoAcampamentoService.buscarInscricaoNome(nome);
        return inscricaoAcampamento != null ? ResponseEntity.status(HttpStatus.OK).body(inscricaoAcampamento) :
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição não encontrada!");
    }

    // Devolve só as inscrições do usuário dono do token
    // Sem inscrição devolve lista vazia, pois é normal para quem acabou de se cadastrar
    @GetMapping(value = "/minhasInscricoes")
    public ResponseEntity<Object> minhaInscricao(@AuthenticationPrincipal Usuario usuarioLogado){
        List<InscricaoAcampamento> inscricoes = inscricaoAcampamentoService.buscarInscricaoUsuario(usuarioLogado.getIdUsuario());
        return ResponseEntity.ok(inscricoes);
    }

    @PostMapping(value = "/gravarInscricao")
    public ResponseEntity<Object> gravarInscricao(@RequestBody InscricaoAcampamento inscricaoAcampamento, @AuthenticationPrincipal Usuario usuarioLogado){
        if(inscricaoAcampamento != null){
            inscricaoAcampamento.setUsuario(usuarioLogado);
            if(inscricaoAcampamentoService.buscarInscricaoUsuarioAcampamento(inscricaoAcampamento.getUsuario().getIdUsuario(),
                    inscricaoAcampamento.getAcampamento().getIdAcampamento()) == null){ // Verifico se o usuario na esta fazendo a inscrição 2x

                String funcao = inscricaoAcampamento.getFuncaoAcampamento().toUpperCase(); // sempre grava em maiúsculas
                if(!funcao.equals("CAMPISTA") && !funcao.equals("SERVO"))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Função inválida: escolha CAMPISTA ou SERVO!");
                // campista só se inscreve como campista e servo só como servo; os outros níveis podem escolher
                String nivel = usuarioLogado.getNivelUsuario().name();
                if((nivel.equals("CAMPISTA") || nivel.equals("SERVO")) && !nivel.equals(funcao))
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Este formulário é para " + funcao + ", mas o seu cadastro é de " + nivel + "!");
                inscricaoAcampamento.setFuncaoAcampamento(funcao);

                // Confere se ainda tem vaga: a capacidade fica no formulário do acampamento para aquela função
                Long idAcampamento = inscricaoAcampamento.getAcampamento().getIdAcampamento();
                Formulario formulario = formularioService.buscarFormularioAcampamentoTipo(idAcampamento, TipoFormulario.valueOf(funcao));
                if(formulario != null && formulario.getCapacidadeFormulario() != null){ // formulário antigo sem capacidade não tem limite
                    long inscritos = inscricaoAcampamentoService.contarInscritos(idAcampamento, funcao);
                    if(inscritos >= formulario.getCapacidadeFormulario())
                        return ResponseEntity.status(HttpStatus.CONFLICT).body("Inscrições esgotadas! Capacidade máxima: " + formulario.getCapacidadeFormulario() + " inscrito(s).");
                }

                // O servo precisa ser aprovado pela coordenação; o campista já vai direto para o pagamento
                if(funcao.equals("SERVO"))
                    inscricaoAcampamento.setStatusAprovacao(InscricaoAcampamentoStatus.AGUARDANDO_APROVACAO);
                else
                    inscricaoAcampamento.setStatusAprovacao(InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE);
                inscricaoAcampamento.setDataRegistro(LocalDateTime.now());
                inscricaoAcampamentoService.save(inscricaoAcampamento);
                return ResponseEntity.status(HttpStatus.OK).body(inscricaoAcampamento);
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Inscrição de acampamento ja realizada");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dados insuficientes para cadastro!");
    }

    @PutMapping(value = "/alterarInscricao/{id}")
    public ResponseEntity<Object> alterarInscricao(@PathVariable Long id, @RequestBody InscricaoAcampamento inscricaoAcampamento){
        if(inscricaoAcampamento != null){
            InscricaoAcampamento inscricaoAcampamentoAux = inscricaoAcampamentoService.buscarInscricao(id);
            inscricaoAcampamento.setIdInscricao(inscricaoAcampamentoAux.getIdInscricao());
            inscricaoAcampamentoService.save(inscricaoAcampamento);
            return ResponseEntity.status(HttpStatus.OK).body("Inscrição de acampamento alterada com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição de acampamento não encontrada!");
    }

    // Alocação de equipe: o coordenador define em qual equipe aquele servo vai trabalhar
    public record EquipeDTO(String equipe) {}
    @PutMapping(value = "/alterarEquipe/{id}")
    public ResponseEntity<Object> alterarEquipe(@PathVariable Long id, @RequestBody EquipeDTO equipeDto){
        InscricaoAcampamento inscricaoAcampamento = inscricaoAcampamentoService.buscarInscricao(id);
        if(inscricaoAcampamento != null){
            if(!"SERVO".equals(inscricaoAcampamento.getFuncaoAcampamento()))
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Somente servos podem ser alocados em equipes!");

            // sempre grava em maiúsculas; se vier vazio, o servo fica sem equipe
            String equipe = equipeDto.equipe() == null ? "" : equipeDto.equipe().trim().toUpperCase();
            inscricaoAcampamento.setEquipeAcampamento(equipe.isEmpty() ? null : equipe);
            inscricaoAcampamentoService.save(inscricaoAcampamento);
            return ResponseEntity.status(HttpStatus.OK).body("Equipe do servo alterada com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição de acampamento não encontrada!");
    }

    // Aprovação do servo: o coordenador aprova ou reprova a inscrição que está aguardando
    public record AvaliacaoDTO(boolean aprovado) {}
    @PutMapping(value = "/avaliarInscricao/{id}")
    public ResponseEntity<Object> avaliarInscricao(@PathVariable Long id, @RequestBody AvaliacaoDTO avaliacaoDto){
        InscricaoAcampamento inscricaoAcampamento = inscricaoAcampamentoService.buscarInscricao(id);
        if(inscricaoAcampamento != null){
            if(inscricaoAcampamento.getStatusAprovacao() != InscricaoAcampamentoStatus.AGUARDANDO_APROVACAO)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Essa inscrição não está aguardando aprovação!");

            if(avaliacaoDto.aprovado())
                inscricaoAcampamento.setStatusAprovacao(InscricaoAcampamentoStatus.APROVADO);
            else{
                inscricaoAcampamento.setStatusAprovacao(InscricaoAcampamentoStatus.REPROVADO);
                inscricaoAcampamentoService.deletarInscricao(inscricaoAcampamento);
            }

            inscricaoAcampamentoService.save(inscricaoAcampamento);
            return ResponseEntity.status(HttpStatus.OK).body("Inscrição de " + inscricaoAcampamento.getUsuario().getNomeUsuario()
                    + (avaliacaoDto.aprovado() ? " aprovada!" : " reprovada!"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição de acampamento não encontrada!");
    }

    @DeleteMapping(value = "/deletarInscricao/{id}")
    public ResponseEntity<Object> deletarInscricao(@PathVariable Long id){
        InscricaoAcampamento inscricaoAcampamento = inscricaoAcampamentoService.buscarInscricao(id);
        if(inscricaoAcampamento != null){
            inscricaoAcampamentoService.deletarInscricao(inscricaoAcampamento);
            return ResponseEntity.status(HttpStatus.OK).body("Inscrição de acampamento deletada com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição de acampamento não encontrada!");
    }
}
