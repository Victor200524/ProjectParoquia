package br.com.paroquia.backend.security;

import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.services.UsuarioService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    UsuarioService usuarioService;
    @Autowired
    TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = recuperarToken(request);

        if (token != null) {
            try {
                // Tenta validar o token e extrair o login/subject
                var subject = tokenService.validarToken(token);

                if (subject != null) {
                    var usuario = usuarioService.getCpfUsuario(subject); // ou findByCpf dependendo de como gera o token

                    // Só autentica se o usuário realmente existir no banco
                    if (usuario != null) {
                        var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception e) {
                // Se o token for falso, malformado ou string de teste ('logado-sucesso'),
                // o sistema apenas ignora silenciosamente em vez de explodir o servidor!
                System.out.println("Token inválido ou ignorado: " + e.getMessage());
            }
        }
        // Envia a requisição para seguir sue fluxo
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}
