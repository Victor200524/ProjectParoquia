package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.Pastoral;
import br.com.paroquia.backend.services.PastoralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/pastoral")
public class PastoralRestControllers {
    @Autowired
    PastoralService pastoralService;

    @GetMapping(value ="/todasPastoral")
    public ResponseEntity<Object> buscarTodasPastorais(){
        List<Pastoral> pastoralList = pastoralService.getAllPastoral();
        if(pastoralList != null && !pastoralList.isEmpty())
            return ResponseEntity.ok(pastoralList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pastorais não cadastradas");
    }

    @GetMapping(value = "/buscarPastoral/{nomePastoral}")
    public ResponseEntity<Object> buscarPastoral(@PathVariable String nomePastoral){
        Pastoral pastoral = pastoralService.getNamePastoral(nomePastoral);
        if (pastoral != null)
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(pastoral);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pastoral não encontrada");
    }

    @PostMapping(value = "/gravarPastoral")
    public ResponseEntity<Object> gravarPastoral(@RequestBody Pastoral pastoral){
        try {
            if(pastoral != null){
                pastoralService.salvarPastoral(pastoral);
                return ResponseEntity.status(HttpStatus.CREATED).body("Pastoral cadastrada: " + pastoral.getNomePastoral());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dados insuficientes para cadastro!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao gravar a Pastoral!");
        }
    }

    @PutMapping(value = "/alterarPastoral/{idPastoral}")
    public ResponseEntity<Object> alterarPastoral(@PathVariable Long idPastoral,@RequestBody Pastoral pastoralAtualizada){
        Pastoral pastoralExistente = pastoralService.getIdPastoral(idPastoral);
        if(pastoralExistente != null){
            pastoralAtualizada.setIdPastoral(pastoralExistente.getIdPastoral());
            pastoralService.salvarPastoral(pastoralAtualizada);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Pastoral alterada com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pastoral não encontrada");
    }

    @DeleteMapping(value = "excluirPastoral/{idPastoral}")
    public ResponseEntity<Object> deletarUsuario(@PathVariable Long idPastoral){
        if(pastoralService.excluirPastoral(idPastoral))
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Pastoral deletado com sucesso");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao deletar as pastoral!");
    }
}
