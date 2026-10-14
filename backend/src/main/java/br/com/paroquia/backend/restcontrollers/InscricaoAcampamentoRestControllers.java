package br.com.paroquia.backend.restcontrollers;


import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.enums.InscricaoAcampamentoStatus;
import br.com.paroquia.backend.services.InscricaoAcampamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/inscricaoAcampamento")
public class InscricaoAcampamentoRestControllers {
    @Autowired
    InscricaoAcampamentoService inscricaoAcampamentoService;

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

    @PostMapping(value = "/gravarInscricao")
    public ResponseEntity<Object> gravarInscricao(@RequestBody InscricaoAcampamento inscricaoAcampamento){
        if(inscricaoAcampamento != null){
            if(inscricaoAcampamentoService.buscarInscricaoUsuarioAcampamento(inscricaoAcampamento.getUsuario().getIdUsuario(),
                    inscricaoAcampamento.getAcampamento().getIdAcampamento()) == null){ // Verifico se o usuario na esta fazendo a inscrição 2x
                if(inscricaoAcampamento.getUsuario().getIdUsuario() != null){ //se o usuario realmente existe
                    inscricaoAcampamento.setFuncaoAcampamento(inscricaoAcampamento.getFuncaoAcampamento().toUpperCase()); // sempre grava em maiúsculas
                    inscricaoAcampamento.setStatusAprovacao(InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE);
                    inscricaoAcampamento.setDataRegistro(LocalDateTime.now());
                    inscricaoAcampamentoService.save(inscricaoAcampamento);
                    return ResponseEntity.status(HttpStatus.OK).body(inscricaoAcampamento);
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario não encontrado!");
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
