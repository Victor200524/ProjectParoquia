package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.HorarioMissa;
import br.com.paroquia.backend.services.HorarioMissaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/horarioMissa")
public class HorarioMissaRestControllers {

    @Autowired
    HorarioMissaService horarioMissaService;

    @GetMapping(value ="/todosHorarios")
    public ResponseEntity<Object> buscarTodosHorarios(){
        List<HorarioMissa> horarioList = horarioMissaService.getAllHorarios();
        if(horarioList != null && !horarioList.isEmpty())
            return ResponseEntity.ok(horarioList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum horário de missa cadastrado.");
    }

    @GetMapping(value = "/buscarPorDia/{semanaMissa}")
    public ResponseEntity<Object> buscarHorarioPorDia(@PathVariable String semanaMissa){
        List<HorarioMissa> horarios = horarioMissaService.getHorariosPorDia(semanaMissa);
        if (horarios != null && !horarios.isEmpty())
            return ResponseEntity.ok(horarios);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma missa encontrada neste dia.");
    }

    @PostMapping(value = "/gravarHorario")
    public ResponseEntity<Object> gravarHorario(@RequestBody HorarioMissa horarioMissa){
        try {
            if(horarioMissa != null && horarioMissa.getComunidade() != null){
                horarioMissaService.salvarHorario(horarioMissa);
                return ResponseEntity.status(HttpStatus.CREATED).body("Horário de missa cadastrado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dados insuficientes. É obrigatório vincular a uma comunidade!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao gravar horário: " + e.getMessage());
        }
    }

    @PutMapping(value = "/alterarHorario/{idHorario}")
    public ResponseEntity<Object> alterarHorario(@PathVariable Long idHorario, @RequestBody HorarioMissa horarioAtualizado){
        try {
            HorarioMissa horarioExistente = horarioMissaService.getIdHorario(idHorario);
            if(horarioExistente != null){
                horarioAtualizado.setIdHorarioMissa(horarioExistente.getIdHorarioMissa());
                if(horarioAtualizado.getComunidade() == null){
                    horarioAtualizado.setComunidade(horarioExistente.getComunidade());
                }
                horarioMissaService.salvarHorario(horarioAtualizado);
                return ResponseEntity.ok("Horário alterado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Horário não encontrado.");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao alterar o Horário de Missa!");
        }
    }

    @DeleteMapping(value = "/excluirHorario/{idHorario}")
    public ResponseEntity<Object> excluirHorario(@PathVariable Long idHorario){
        HorarioMissa horarioExistente = horarioMissaService.getIdHorario(idHorario);

        if(horarioExistente != null){
            horarioMissaService.excluirHorario(idHorario);
            return ResponseEntity.ok("Horário de missa excluído com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Horário não encontrado!");
    }

}