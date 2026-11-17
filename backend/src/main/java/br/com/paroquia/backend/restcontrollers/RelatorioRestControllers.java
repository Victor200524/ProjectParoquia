package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.services.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Relatórios de saída (imprimir / salvar PDF). ADMIN e COORDENADOR, ver SecurityConfig.
@CrossOrigin
@RestController
@RequestMapping(value = "/relatorio")
public class RelatorioRestControllers {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping(value = "/prestacaoContas/{idAcampamento}")
    public ResponseEntity<Object> prestacaoContas(@PathVariable Long idAcampamento) {
        return ResponseEntity.ok(relatorioService.montarPrestacaoContas(idAcampamento));
    }
}
