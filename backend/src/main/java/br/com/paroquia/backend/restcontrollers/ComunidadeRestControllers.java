package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.Comunidade;
import br.com.paroquia.backend.entities.HorarioMissa;
import br.com.paroquia.backend.services.ComunidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@CrossOrigin
@RequestMapping(value = "/comunidade")
public class ComunidadeRestControllers {
    @Autowired
    ComunidadeService comunidadeService;

    @GetMapping(value ="/todasComunidades")
    public ResponseEntity<Object> buscarTodasComunidades(){
        List<Comunidade> comunidadeList = comunidadeService.getAllComunidades();
        if(comunidadeList != null && !comunidadeList.isEmpty())
            return ResponseEntity.ok(comunidadeList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma comunidade cadastrada.");
    }

    @GetMapping(value = "/buscarComunidade/{nomeComunidade}")
    public ResponseEntity<Object> buscarComunidade(@PathVariable String nomeComunidade){
        Comunidade comunidade = comunidadeService.getNameComunidade(nomeComunidade);
        if (comunidade != null)
            return ResponseEntity.ok(comunidade);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comunidade não encontrada.");
    }

    @PostMapping(value = "/gravarComunidade")
    public ResponseEntity<Object> gravarComunidade(@RequestPart("comunidade") Comunidade comunidade, @RequestPart(value = "foto", required = false) MultipartFile foto) {
        try {
            if(comunidade != null){
                if(foto != null && !foto.isEmpty()){
                    comunidade.setFotoComunidade(foto.getBytes());
                }
                if (comunidade.getHorariosMissa() != null) {
                    for (HorarioMissa horario : comunidade.getHorariosMissa())
                        horario.setComunidade(comunidade);
                }
                if(!comunidadeService.isTelefoneValido(comunidade.getContatoComunidade()))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de telefone inválido.");

                comunidadeService.salvarComunidade(comunidade);
                return ResponseEntity.status(HttpStatus.CREATED).body("Comunidade cadastrada com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dados insuficientes para cadastro!");
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao gravar: " + e.getMessage());
        }
    }

    @PutMapping(value = "/alterarComunidade/{idComunidade}")
    public ResponseEntity<Object> alterarComunidade(@PathVariable Long idComunidade, @RequestPart("comunidade") Comunidade comunidadeAtualizada, @RequestPart(value = "foto", required = false) MultipartFile foto){
        try {
            Comunidade comunidadeExistente = comunidadeService.getIdComunidade(idComunidade);
            if(comunidadeExistente != null){
                comunidadeAtualizada.setIdComunidade(comunidadeExistente.getIdComunidade());

                if(foto != null && !foto.isEmpty()){
                    comunidadeAtualizada.setFotoComunidade(foto.getBytes());
                } else {
                    comunidadeAtualizada.setFotoComunidade(comunidadeExistente.getFotoComunidade());
                }

                if (comunidadeAtualizada.getHorariosMissa() != null) {
                    for (HorarioMissa horario : comunidadeAtualizada.getHorariosMissa())
                        horario.setComunidade(comunidadeAtualizada);
                }

                if(!comunidadeService.isTelefoneValido(comunidadeAtualizada.getContatoComunidade()))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de telefone inválido.");

                comunidadeService.salvarComunidade(comunidadeAtualizada);
                return ResponseEntity.ok("Comunidade alterada com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comunidade não encontrada.");
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao alterar: " + e.getMessage());
        }
    }

    @DeleteMapping(value = "/excluirComunidade/{idComunidade}")
    public ResponseEntity<Object> excluirComunidade(@PathVariable Long idComunidade){
        Comunidade comunidadeExistente = comunidadeService.getIdComunidade(idComunidade);
        if(comunidadeExistente != null){
            comunidadeService.excluirComunidade(idComunidade);
            return ResponseEntity.ok("Comunidade excluída com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comunidade não encontrada!");
    }
}