package br.com.paroquia.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
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

    @Column(name = "\"nivel_Usuario\"")
    private Integer nivelUsuario;

    @Column(name = "\"status_Usuario\"")
    private Integer statusUsuario;

    @Column(name = "\"contato_Usuario\"")
    private String contatoUsuario;

    @Column(name = "\"cpf_Usuario\"", unique = true)
    private String cpfUsuario;

    public Usuario() {
        this(0L, "", "", "", 0, "", 0, "");
    }

    public Usuario(Long idUsuario, String nomeUsuario, String emailUsuario, String senhaUsuario, Integer nivelUsuario, String contatoUsuario, Integer statusUsuario, String cpfUsuario) {
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

    public Integer getNivelUsuario() {
        return nivelUsuario;
    }

    public void setNivelUsuario(Integer nivelUsuario) {
        this.nivelUsuario = nivelUsuario;
    }

    public Integer getStatusUsuario() {
        return statusUsuario;
    }

    public void setStatusUsuario(Integer statusUsuario) {
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
        // Traduz o nivelUsuario para as ROLES do Spring
        if (this.nivelUsuario != null && this.nivelUsuario == 0) // Coordenador Geral / Padre / Secretaria
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        else if (this.nivelUsuario != null && this.nivelUsuario == 1)// Coordenador do Acampamento
            return List.of(new SimpleGrantedAuthority("ROLE_COORDENADOR"), new SimpleGrantedAuthority("ROLE_USER"));
        else // Campista / Servo
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
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
