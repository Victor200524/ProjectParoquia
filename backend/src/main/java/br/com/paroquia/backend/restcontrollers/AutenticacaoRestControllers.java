package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.dtos.DadosAutenticacaoDTO;
import br.com.paroquia.backend.dtos.DadosTokenJWT;
import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/autenticacao")
@CrossOrigin
public class AutenticacaoRestControllers {
    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacaoDTO dados) {
        // Monta o objeto
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        // Gera o Token JWT para aquele usuario
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        // Devolve o Token em formato JSON para o front-end guardar
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }
}
