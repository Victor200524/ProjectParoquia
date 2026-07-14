package br.com.paroquia.backend.security;

import br.com.paroquia.backend.entities.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    // Faço a geração do token, usado para o login
    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("paroquia-api") // Quem está enviando o token
                    .withSubject(usuario.getEmailUsuario()) // Salvo no token o email do usuário
                    .withExpiresAt(gerarDataExpiracao()) // Tempo de vida do token
                    .sign(algorithm); // Assina e fecha o token
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("paroquia-api")
                    .build()
                    .verify(token) // Verifica se não é falso ou se não expirou
                    .getSubject(); // Devolve o email
        } catch (JWTVerificationException exception) {
            return ""; // Devolve vazio, e por padrao o spring ja bloqueia
        }
    }

    // Token valido somente por 2 horas
    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}