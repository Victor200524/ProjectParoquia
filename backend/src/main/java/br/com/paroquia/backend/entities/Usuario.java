package br.com.paroquia.backend.entities;

import br.com.paroquia.backend.enums.UsuarioTipoNivel;
import br.com.paroquia.backend.enums.UsuarioTipoStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuario")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Usuario\"")
    private Long idUsuario;

    @Column(name = "\"nome_Usuario\"")
    private String nomeUsuario;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    @Column(name = "\"email_Usuario\"", unique = true)
    private String emailUsuario;

    @Column(name = "\"senha_Usuario\"")
    private String senhaUsuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"nivel_Usuario\"")
    private UsuarioTipoNivel nivelUsuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"status_Usuario\"")
    private UsuarioTipoStatus statusUsuario;

    @Column(name = "\"contato_Usuario\"")
    private String contatoUsuario;

    @Column(name = "\"cpf_Usuario\"", unique = true)
    private String cpfUsuario;

    public Usuario() {
    }

    public Usuario(Long idUsuario, String nomeUsuario, String emailUsuario, String senhaUsuario, UsuarioTipoNivel nivelUsuario, String contatoUsuario, UsuarioTipoStatus statusUsuario, String cpfUsuario) {
        this.idUsuario = idUsuario;
        this.nomeUsuario = nomeUsuario;
        this.emailUsuario = emailUsuario;
        this.senhaUsuario = senhaUsuario;
        this.nivelUsuario = nivelUsuario;
        this.contatoUsuario = contatoUsuario;
        this.statusUsuario = statusUsuario;
        this.cpfUsuario = cpfUsuario;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public String getEmailUsuario() {
        return emailUsuario;
    }

    public void setEmailUsuario(String emailUsuario) {
        this.emailUsuario = emailUsuario;
    }

    public String getSenhaUsuario() {
        return senhaUsuario;
    }

    public void setSenhaUsuario(String senhaUsuario) {
        this.senhaUsuario = senhaUsuario;
    }

    public UsuarioTipoNivel getNivelUsuario() {
        return nivelUsuario;
    }

    public void setNivelUsuario(UsuarioTipoNivel nivelUsuario) {
        this.nivelUsuario = nivelUsuario;
    }

    public UsuarioTipoStatus getStatusUsuario() {
        return statusUsuario;
    }

    public void setStatusUsuario(UsuarioTipoStatus statusUsuario) {
        this.statusUsuario = statusUsuario;
    }

    public String getContatoUsuario() {
        return contatoUsuario;
    }

    public void setContatoUsuario(String contatoUsuario) {
        this.contatoUsuario = contatoUsuario;
    }

    public String getCpfUsuario() {
        return cpfUsuario;
    }

    public void setCpfUsuario(String cpfUsuario) {
        this.cpfUsuario = cpfUsuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.nivelUsuario == null) {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return switch (this.nivelUsuario) {
            case COORDENADOR_GERAL, PADRE, SECRETARIA -> List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER")
            );

            case COORDENADOR_ACAMPAMENTO -> List.of(
                    new SimpleGrantedAuthority("ROLE_COORDENADOR"),
                    new SimpleGrantedAuthority("ROLE_USER")
            );

            case SERVO, CAMPISTA -> List.of(
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        };
    }

    @Override
    public String getPassword() {
        return this.senhaUsuario;
    }

    @Override
    public String getUsername() {
        return this.emailUsuario;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() { // Barrar usuarios inativos
        return true;
    }

}
