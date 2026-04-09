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
        if(pastoralList != null)
            return ResponseEntity.ok(pastoralList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pastorais não cadastradas");
    }

    @GetMapping(value = "/buscarPastoral/{nomePastoral}")
    public ResponseEntity<Object> buscarPastoral(@PathVariable String nomePastoral){
        Pastoral pastoral = pastoralService.getNamePastoral(nomePastoral);
        if (pastoral != null)
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(pastoral);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pastorais não encontrada");
    }
}
