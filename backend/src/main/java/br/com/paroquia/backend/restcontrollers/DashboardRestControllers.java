package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/dashboard")
public class DashboardRestControllers {

    @Autowired
    private DashboardService dashboardService;

    // Números do Dashboard de um acampamento (ADMIN e COORDENADOR, ver SecurityConfig)
    @GetMapping(value = "/{idAcampamento}")
    public ResponseEntity<Object> dashboard(@PathVariable Long idAcampamento) {
        return ResponseEntity.ok(dashboardService.montarDashboard(idAcampamento));
    }
}
