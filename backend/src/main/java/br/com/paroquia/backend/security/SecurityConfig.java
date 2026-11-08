package br.com.paroquia.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import static org.springframework.security.config.Customizer.withDefaults;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        /*
                        * Nivel dos usuários
                        * 0 - Coordenador Geral/Padre/Secreatária - ROLE_ADMIN
                        * 1 - Coordenador dos Acampamentos - ROLE_COORDENADOR
                        * 2 - Campistas / Servo - ROLE_USER
                        * */

                        // Rotas bloqueadas por nível
                        // --- Acampamento ---
                        .requestMatchers(HttpMethod.GET,"/acampamento/publico").permitAll()
                         .requestMatchers("/acampamento/**").hasRole("ADMIN")

                        // --- Doação ---
                        .requestMatchers("/doacao/**").hasAnyRole("ADMIN", "COORDENADOR")

                        // --- Comunidade ---
                        .requestMatchers(HttpMethod.GET,"/comunidade/**").permitAll()
                        .requestMatchers("/comunidade/**").hasRole("ADMIN")

                        // --- Pastoral ---
                        .requestMatchers("/pastoral/**").hasRole("ADMIN")

                        // --- Usuario ---
                        .requestMatchers(HttpMethod.GET,"/usuario/validarToken").authenticated() // So entra quem tem o token validado
                        .requestMatchers(HttpMethod.POST, "/usuario/cadastrarUsuario").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuario/loginUsuario").permitAll()
                        .requestMatchers("/usuario/**").hasRole("ADMIN")

                        // --- Movimentação Estoque ---
                        .requestMatchers("/movimentacaoEstoque/**").hasAnyRole("ADMIN", "COORDENADOR")

                        // --- Item Estoque ---
                        .requestMatchers("/itemEstoque/**").hasAnyRole("ADMIN", "COORDENADOR")

                        // --- Mural Fotos ---
                        .requestMatchers(HttpMethod.GET,"/muralFotos/**").permitAll()
                        .requestMatchers("/muralFotos/**").hasAnyRole("ADMIN", "COORDENADOR")

                        // --- Formularios ---
                        .requestMatchers(HttpMethod.GET,"/formulario/**").hasRole("USER")
                        .requestMatchers("/formulario/**").hasAnyRole("ADMIN", "COORDENADOR")

                        // --- Perguntas ---
                        .requestMatchers(HttpMethod.GET,"/pergunta/**").hasRole("USER")
                        .requestMatchers("/pergunta/**").hasAnyRole("ADMIN", "COORDENADOR")

                        // --- Resposta ---
                        .requestMatchers(HttpMethod.POST,"/resposta/gravarResposta").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/resposta/buscarRespostasPorInscricao/**").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/resposta/alterarResposta/**").hasRole("USER")
                        .requestMatchers("/resposta/**").hasAnyRole("ADMIN", "COORDENADOR")

                        // --- Inscrição Acampamento ---
                        .requestMatchers("/inscricaoAcampamento/minhasInscricoes").authenticated()
                        .requestMatchers(HttpMethod.POST,"/inscricaoAcampamento/gravarInscricao").hasRole("USER")
                        .requestMatchers("/inscricaoAcampamento/**").hasAnyRole("ADMIN", "COORDENADOR")

                        // --- Pagamento ---
                        .requestMatchers(HttpMethod.POST, "/pagamento/criarPreferencia").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/pagamento/verificarPagamento/**").hasRole("USER")
                        .requestMatchers("/pagamento/**").hasAnyRole("ADMIN", "COORDENADOR")

                        // --- Erros ---
                        .requestMatchers("/error").permitAll() // Desmascara os erros internos

                        // Qualquer outra requisição precisa do Token (Usuário logado)
                        .anyRequest().authenticated()
                )
                // AVISO PARA O SPRING: "Rode o MEU filtro antes do filtro padrão do Spring"
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        //Libero a porta da onde meu frontend ira rodar
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8080"));

        // Libera os métodos HTTP que o frontend pode usar
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public org.springframework.security.authentication.AuthenticationManager authenticationManager(org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}