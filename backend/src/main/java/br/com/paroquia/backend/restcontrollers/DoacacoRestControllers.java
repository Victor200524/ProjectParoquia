package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.Doacao;
import br.com.paroquia.backend.services.DoacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "doacao")
public class DoacacoRestControllers {
    @Autowired
    private DoacaoService doacaoService;

    @GetMapping(value = "/todasDoacoes")
    ResponseEntity<Object> exibirTodasDoacoes(){
        List<Doacao> doacaoList = doacaoService.todasDoacoes();
        if(doacaoList != null)
            return ResponseEntity.ok(doacaoList);
        return ResponseEntity.status(HttpStatus.OK).body("Nenhuma doação cadastrada!");
    }

    @GetMapping(value = "/buscarDoacao/{nomeDoacao}")
    ResponseEntity<Object> buscarDoacao(@PathVariable String nomeDoacao){
        Doacao doacao = doacaoService.buscarNomeDoacao(nomeDoacao);
        if(doacao != null)
            return ResponseEntity.ok(doacao);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doação não encontrada!");
    }

    @PostMapping(value = "/gravarDoacao")
    ResponseEntity<Object> gravarDoacao(@RequestBody Doacao doacao){
        try {
            Doacao doacaoAux = doacaoService.buscarNomeDoacao(doacao.getNomeDoacao());
            if(doacaoAux == null){ // se nao existe o doacao com o mesmo nome
                if(doacao.getQtdeDoacao() > 0) { // verifico se a quantidade colocada é maior do que 0
                    if(doacao.getDataDoacao() != null){
                        doacaoService.gravarDoacao(doacao);
                        return ResponseEntity.status(HttpStatus.CREATED).body("Doção cadastrada com sucesso!");
                    }
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Precisa especificar a data da doação!");
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantidade tem que ser maior que 0!");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Doação ja cadastrada!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao gravar a Doação!");
        }
    }

    @PutMapping(value = "/alterarDoacao/{idDoacao}")
    ResponseEntity<Object> alterarDoacao(@PathVariable Long idDoacao, @RequestBody Doacao doacaoAtualizada){
        try {
            Doacao doacao = doacaoService.buscarIdDoacao(idDoacao);
            if(doacao != null){
                doacaoAtualizada.setIdDoacao(doacao.getIdDoacao());
                if(doacaoAtualizada.getQtdeDoacao() > 0){
                    doacaoService.gravarDoacao(doacaoAtualizada);
                    return ResponseEntity.status(HttpStatus.OK).body("Doação alterada com sucesso!");
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantidade tem que ser maior que 0!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doação não encontrada!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao alterar a Doação!");
        }
    }

    @DeleteMapping(value = "/deletarDoacao/{idDoacao}")
    ResponseEntity<Object> deletarDoacao(@PathVariable Long idDoacao){
        Doacao doacao = doacaoService.buscarIdDoacao(idDoacao);
        if(doacao != null){
            doacaoService.deletarDoacao(doacao);
            return ResponseEntity.status(HttpStatus.OK).body("Doação deletada com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doação não encontrada!");
    }

}
