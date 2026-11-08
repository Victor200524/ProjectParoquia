package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.dtos.AcampamentoPublicoDTO;
import br.com.paroquia.backend.entities.Acampamento;
import br.com.paroquia.backend.services.AcampamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/acampamento")
public class AcampamentoRestControllers {
    @Autowired
    AcampamentoService acampamentoService;

    @GetMapping(value = "/todosAcampamentos")
    public ResponseEntity<Object> getAllAcampamentos() {
        List<Acampamento> acampamentoList = acampamentoService.getAllAcampamentos();
        if (acampamentoList != null && !acampamentoList.isEmpty())
            return ResponseEntity.ok(acampamentoList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum acampamento cadastrado");
    }

    @GetMapping(value = "/publico")
    public ResponseEntity<Object> getAcampamentosPublicos() {
        List<Acampamento> acampamentoList = acampamentoService.getAllAcampamentos();
        List<AcampamentoPublicoDTO> acampamentoPublicoDTOList = acampamentoList.stream().map(a-> new AcampamentoPublicoDTO(
                a.getIdAcampamento(),
                a.getNomeAcampamento(),
                a.getLocalAcampamento(),
                a.getIdadeMinAcampamento(),
                a.getIdadeMaxAcampamento(),
                a.getTaxaInscricaoAcampamento(),
                a.getVagasAcampamento(),
                a.getDataInicioAcampamento(),
                a.getDataFimAcampamento(),
                a.getInformacoesAcampamento(),
                a.getFotoAcampamento(),
                a.getComunidade()
        )).toList();
        if(!acampamentoPublicoDTOList.isEmpty())
            return ResponseEntity.ok(acampamentoPublicoDTOList);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum acampamento cadastrado");
    }

    @GetMapping(value = "/buscarAcampamento/{idAcampamento}")
    public ResponseEntity<Object> getAcampamentoById(@PathVariable Long idAcampamento) {
        Acampamento acampamento = acampamentoService.getAcampamentoById(idAcampamento);
        if (acampamento != null)
            return ResponseEntity.ok(acampamento);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Acampamento não encontrado!");
    }

    @PostMapping(value = "/gravarAcampamento", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> gravarAcampamento(@RequestPart("acampamento") Acampamento acampamento, @RequestPart(value = "foto", required = false) MultipartFile foto) {
        if (acampamento != null) {
            try {
                if (foto != null && !foto.isEmpty())
                    acampamento.setFotoAcampamento(foto.getBytes());
                Acampamento novoAcampamento = acampamentoService.saveAcampamento(acampamento);
                return ResponseEntity.status(HttpStatus.CREATED).body("Acampamento '" + novoAcampamento.getNomeAcampamento() + "' criado com sucesso!");

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dados insuficientes para gravar o acampamento!");
    }

    @PutMapping(value = "/alterarAcampamento/{idAcampamento}")
    public ResponseEntity<Object> alterarAcampamento(@PathVariable Long idAcampamento, @RequestBody Acampamento acampamentoAtualizado) {
        Acampamento acampamentoExistente = acampamentoService.getAcampamentoById(idAcampamento);
        if (acampamentoExistente != null) {
            try {
                acampamentoAtualizado.setIdAcampamento(acampamentoExistente.getIdAcampamento());
                // Token e usuário não voltam para o front (WRITE_ONLY); se vierem vazios, mantém os que já estão no banco
                String tokenNovo = acampamentoAtualizado.getTokenMercadoPagoAcampamento();
                if (tokenNovo == null || tokenNovo.isBlank()) {
                    acampamentoAtualizado.setTokenMercadoPagoAcampamento(acampamentoExistente.getTokenMercadoPagoAcampamento());
                }
                if (acampamentoAtualizado.getUsuario() == null) {
                    acampamentoAtualizado.setUsuario(acampamentoExistente.getUsuario());
                }
                Acampamento acampamentoSalvo = acampamentoService.saveAcampamento(acampamentoAtualizado);
                return ResponseEntity.ok("Acampamento '" + acampamentoSalvo.getNomeAcampamento() + "' alterado com sucesso!");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Acampamento não encontrado para alteração!");
    }

    @DeleteMapping(value = "/deletarAcampamento/{idAcampamento}")
    public ResponseEntity<Object> deletarAcampamento(@PathVariable Long idAcampamento) {
        if (acampamentoService.excluirAcampamento(idAcampamento))
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Acampamento deletado com sucesso");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao deletar o acampamento");
    }

}
