package br.com.paroquia.backend.restcontrollers;


import br.com.paroquia.backend.repositories.InscricaoAcampamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping(value = "/inscricao-acampamento")
public class InscricaoAcampamentoRestControllers {
    @Autowired
    InscricaoAcampamentoRepository inscricaoAcampamentoRepository;
}
