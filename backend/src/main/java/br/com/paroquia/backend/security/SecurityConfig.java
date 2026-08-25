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
                        // Essas rotas sao abertas devido elas nao precisarem de tokens
                        .requestMatchers(HttpMethod.POST, "/autenticacao").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuario/**").permitAll()

                        // Deixei liberado devido as testes dos pix que estou fazendo
                        .requestMatchers("/pagamento/**").permitAll()

                        /*
                        * Nivel dos usuários
                        * 0 - Coordenador Geral/Padre/Secreatária
                        * 1 - Coordenador dos Acampamentos
                        * 2 - Campistas / Servo
                        * */

                        // Rotas bloqueadas por nível
                         .requestMatchers("/acampamento/**").permitAll()//.hasRole("COORDENADOR")
                        .requestMatchers("/doacao/**").permitAll()
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