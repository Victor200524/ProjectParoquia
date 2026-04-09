package br.com.paroquia.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Usuario\"")
    private Long idUsuario;

    @Column(name = "\"nome_Usuario\"")
    private String nomeUsuario;

    @Column(name = "\"email_Usuario\"")
    private String emailUsuario;

    @Column(name = "\"senha_Usuario\"")
    private String senhaUsuario;

    @Column(name = "\"nivel_Usuario\"")
    private int nivelUsuario;

    @Column(name = "\"contato_Usuario\"")
    private String contatoUsuario;

    public Usuario() {
        this(0L, "", "", "", 0, "");
    }

    public Usuario(Long idUsuario, String nomeUsuario, String emailUsuario, String senhaUsuario, int nivelUsuario, String contatoUsuario) {
        this.idUsuario = idUsuario;
        this.nomeUsuario = nomeUsuario;
        this.emailUsuario = emailUsuario;
        this.senhaUsuario = senhaUsuario;
        this.nivelUsuario = nivelUsuario;
        this.contatoUsuario = contatoUsuario;
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

    public int getNivelUsuario() {
        return nivelUsuario;
    }

    public void setNivelUsuario(int nivelUsuario) {
        this.nivelUsuario = nivelUsuario;
    }

    public String getContatoUsuario() {
        return contatoUsuario;
    }

    public void setContatoUsuario(String contatoUsuario) {
        this.contatoUsuario = contatoUsuario;
    }
}
