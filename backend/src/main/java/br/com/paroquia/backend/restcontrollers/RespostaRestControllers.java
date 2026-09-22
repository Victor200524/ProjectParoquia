package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Resposta;
import br.com.paroquia.backend.services.InscricaoAcampamentoService;
import br.com.paroquia.backend.services.RespostaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Object> buscarRespostasPorInscricao(@PathVariable Long idInscricao){
        InscricaoAcampamento inscricao = inscricaoAcampamentoService.buscarInscricao(idInscricao);
        if(inscricao != null){
            List<Resposta> respostaList = respostaService.getRespostasPorInscricao(inscricao);
            if(respostaList != null && !respostaList.isEmpty())
                return ResponseEntity.status(HttpStatus.OK).body(respostaList);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma resposta cadastrada para esta inscrição!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscrição não encontrada!");
    }

    @PostMapping(value = "/gravarResposta")
    public ResponseEntity<Object> gravarResposta(@RequestBody Resposta resposta){
        try {
            if(resposta != null){
                respostaService.save(resposta);
                return ResponseEntity.status(HttpStatus.OK).body("Resposta cadastrada com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dados insuficientes para cadastro!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao gravar a Resposta!");
        }
    }

    @PutMapping(value = "/alterarResposta/{id}")
    public ResponseEntity<Object> alterarResposta(@PathVariable Long id, @RequestBody Resposta resposta){
        try {
            Resposta respostaAux = respostaService.getRespostaId(id);
            if(respostaAux != null){
                resposta.setIdResposta(respostaAux.getIdResposta());
                respostaService.save(resposta);
                return ResponseEntity.status(HttpStatus.OK).body("Resposta alterada com sucesso!");
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
