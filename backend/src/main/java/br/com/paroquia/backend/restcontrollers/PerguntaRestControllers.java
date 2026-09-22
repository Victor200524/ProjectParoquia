package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.entities.Pergunta;
import br.com.paroquia.backend.services.FormularioService;
import br.com.paroquia.backend.services.PerguntaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "pergunta")
public class PerguntaRestControllers {
    @Autowired
    PerguntaService perguntaService;

    @Autowired
    FormularioService formularioService;

    @GetMapping(value = "/todasPerguntas")
    public ResponseEntity<Object> todasPerguntas(){
        List<Pergunta> perguntaList = perguntaService.getAll();
        if(perguntaList != null && !perguntaList.isEmpty())
            return ResponseEntity.status(HttpStatus.OK).body(perguntaList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma pergunta cadastrada!");
    }

    @GetMapping(value = "/buscarPerguntasPorFormulario/{idFormulario}")
    public ResponseEntity<Object> buscarPerguntasPorFormulario(@PathVariable Long idFormulario){
        Formulario formulario = formularioService.getFormularioId(idFormulario);
        if(formulario != null){
            List<Pergunta> perguntaList = perguntaService.getPerguntasPorFormulario(formulario);
            if(perguntaList != null && !perguntaList.isEmpty())
                return ResponseEntity.status(HttpStatus.OK).body(perguntaList);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma pergunta cadastrada para este formulário!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Formulario não encontrado!");
    }

    @PostMapping(value = "/gravarPergunta")
    public ResponseEntity<Object> gravarPergunta(@RequestBody Pergunta pergunta){
        try {
            if(pergunta != null){
                perguntaService.save(pergunta);
                return ResponseEntity.status(HttpStatus.OK).body("Pergunta cadastrada com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dados insuficientes para cadastro!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao gravar a Pergunta!");
        }
    }

    @PutMapping(value = "/alterarPergunta/{id}")
    public ResponseEntity<Object> alterarPergunta(@PathVariable Long id, @RequestBody Pergunta pergunta){
        try {
            Pergunta perguntaAux = perguntaService.getPerguntaId(id);
            if(perguntaAux != null){
                pergunta.setIdPergunta(perguntaAux.getIdPergunta());
                perguntaService.save(pergunta);
                return ResponseEntity.status(HttpStatus.OK).body("Pergunta alterada com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pergunta não encontrada!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao alterar a Pergunta!");
        }
    }

    @DeleteMapping(value = "/deletarPergunta/{id}")
    public ResponseEntity<Object> deletarPergunta(@PathVariable Long id){
        Pergunta pergunta = perguntaService.getPerguntaId(id);
        if(pergunta != null){
            if(perguntaService.deletarPergunta(pergunta))
                return ResponseEntity.status(HttpStatus.OK).body("Pergunta deletada com sucesso!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Não é possível excluir: existem respostas cadastradas para esta pergunta!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pergunta não encontrada!");
    }
}
