package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.MuralFotos;
import br.com.paroquia.backend.services.MuralFotosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "muralFotos")
public class MuralFotosRestControllers {

    @Autowired
    private MuralFotosService muralFotosService;

    @GetMapping(value = "/getAllMurais")
    public ResponseEntity<Object> getAllMurais() {
        List<MuralFotos> muralList = muralFotosService.getAllMurais();
        if (muralList != null && !muralList.isEmpty()) {
            return ResponseEntity.ok(muralList);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum mural de fotos cadastrado.");
    }

    @GetMapping(value = "/buscarMural/{idMuralFotos}")
    public ResponseEntity<Object> getMuralById(@PathVariable Long idMuralFotos) {
        MuralFotos mural = muralFotosService.getMuralById(idMuralFotos);
        if (mural != null) {
            return ResponseEntity.ok(mural);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mural de fotos não encontrado!");
    }

    // Traz todas as fotos de um evento específico!
    @GetMapping(value = "/acampamento/{idAcampamento}")
    public ResponseEntity<Object> getMuraisDoAcampamento(@PathVariable Long idAcampamento) {
        List<MuralFotos> murais = muralFotosService.getMuraisDoAcampamento(idAcampamento);
        if (murais != null && !murais.isEmpty()) {
            return ResponseEntity.ok(murais);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum mural de fotos encontrado para este acampamento.");
    }

    @PostMapping(value = "/gravarMural")
    public ResponseEntity<Object> gravarMural(@RequestBody MuralFotos mural) {
        if (mural != null) {
            try {
                MuralFotos novoMural = muralFotosService.saveMural(mural);
                return ResponseEntity.status(HttpStatus.CREATED).body("Mural '" + novoMural.getTituloMuralFotos() + "' criado com sucesso!");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao gravar mural: " + e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dados insuficientes para gravar o mural de fotos!");
    }

    @PutMapping(value = "/alterarMural/{idMuralFotos}")
    public ResponseEntity<Object> alterarMural(@PathVariable Long idMuralFotos, @RequestBody MuralFotos muralAtualizado) {
        MuralFotos muralExistente = muralFotosService.getMuralById(idMuralFotos);

        if (muralExistente != null) {
            try {
                muralAtualizado.setIdMuralFotos(muralExistente.getIdMuralFotos());
                MuralFotos muralSalvo = muralFotosService.saveMural(muralAtualizado);
                return ResponseEntity.ok("Mural '" + muralSalvo.getTituloMuralFotos() + "' alterado com sucesso!");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mural de fotos não encontrado para alteração!");
    }

    @DeleteMapping(value = "/deletarMural/{idMuralFotos}")
    public ResponseEntity<Object> deletarMural(@PathVariable Long idMuralFotos) {
        if (muralFotosService.excluirMural(idMuralFotos)) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Mural de fotos deletado com sucesso.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao deletar o mural de fotos. Verifique se ele existe.");
    }
}