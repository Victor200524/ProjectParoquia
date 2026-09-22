package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.services.FormularioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "formulario")
public class FormularioRestControllers {
    @Autowired
    FormularioService formularioService;

    @GetMapping(value = "/todosFormularios")
    public ResponseEntity<Object> todosFormularios(){
        List<Formulario> formularioList = formularioService.getAll();
        if(formularioList != null && !formularioList.isEmpty())
            return ResponseEntity.status(HttpStatus.OK).body(formularioList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma formulário cadastrado!");
    }

    @GetMapping(value = "/buscarFormulario/{titulo}")
    public ResponseEntity<Object> buscarFormulario(@PathVariable String titulo){
        List<Formulario> formularioList = formularioService.getFormulario(titulo);
        if(formularioList != null && !formularioList.isEmpty())
            return ResponseEntity.status(HttpStatus.OK).body(formularioList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma formulário encontrado!");
    }

    @PostMapping(value = "/gravarFormulario")
    public ResponseEntity<Object> gravarFormulario(@RequestBody Formulario formulario){
        try {
            if(formulario != null){
                formularioService.save(formulario);
                return ResponseEntity.status(HttpStatus.OK).body("Formulario cadastrado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dados insuficientes para cadastro!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao gravar o Formulario!");
        }
    }

    @PutMapping(value = "/alterarFormulario/{id}")
    public ResponseEntity<Object> alterarFormulario(@PathVariable Long id, @RequestBody Formulario formulario){
        try {
            Formulario formularioAux = formularioService.getFormularioId(id);
            if(formularioAux != null){
                formulario.setIdFormulario(formularioAux.getIdFormulario());
                formularioService.save(formulario);
                return ResponseEntity.status(HttpStatus.OK).body("Formulario alterado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Formulario não encontrado!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao alterar o Formulario!");
        }
    }

    @DeleteMapping(value = "/deletarFormulario/{id}")
    public ResponseEntity<Object> deletarFormulario(@PathVariable Long id){
        Formulario formulario = formularioService.getFormularioId(id);
        if(formulario != null){
            if(formularioService.deletarFormulario(formulario))
                return ResponseEntity.status(HttpStatus.OK).body("Formulario deletado com sucesso!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Não é possível excluir: existem perguntas cadastradas neste formulário!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Formulario não encontrado!");
    }

}
