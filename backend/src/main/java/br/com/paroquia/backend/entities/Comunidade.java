package br.com.paroquia.backend.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comunidade")
public class Comunidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Comunidade\"")
    private Long idComunidade;

    @Column(name = "\"nome_Comunidade\"")
    private String nomeComunidade;

    @Column(name = "\"endereco_Comunidade\"")
    private String enderecoComunidade;

    @Column(name = "\"contato_Comunidade\"")
    private String contatoComunidade;

    @Column(name = "\"foto_Comunidade\"")
    private String fotoComunidade;

    // Relacionamento do 1:N com HorarioMissa
    @OneToMany(mappedBy = "comunidade", cascade = CascadeType.ALL) // CascadeType.ALL -> Se salvar a comunidade salva os horários juntos
    private List<HorarioMissa> horariosMissa = new ArrayList<>();

    public Comunidade() {
    }


    public Comunidade(Long idComunidade, String nomeComunidade, String enderecoComunidade, String contatoComunidade, String fotoComunidade) {
        this.idComunidade = idComunidade;
        this.nomeComunidade = nomeComunidade;
        this.enderecoComunidade = enderecoComunidade;
        this.contatoComunidade = contatoComunidade;
        this.fotoComunidade = fotoComunidade;
    }

    public Long getIdComunidade() {
        return idComunidade;
    }

    public void setIdComunidade(Long idComunidade) {
        this.idComunidade = idComunidade;
    }

    public String getNomeComunidade() {
        return nomeComunidade;
    }

    public void setNomeComunidade(String nomeComunidade) {
        this.nomeComunidade = nomeComunidade;
    }

    public String getEnderecoComunidade() {
        return enderecoComunidade;
    }

    public void setEnderecoComunidade(String enderecoComunidade) {
        this.enderecoComunidade = enderecoComunidade;
    }

    public String getContatoComunidade() {
        return contatoComunidade;
    }

    public void setContatoComunidade(String contatoComunidade) {
        this.contatoComunidade = contatoComunidade;
    }

    public List<HorarioMissa> getHorariosMissa() {
        return horariosMissa;
    }

    public void setHorariosMissa(List<HorarioMissa> horariosMissa) {
        this.horariosMissa = horariosMissa;
    }

    public String getFotoComunidade() {
        return fotoComunidade;
    }

    public void setFotoComunidade(String fotoComunidade) {
        this.fotoComunidade = fotoComunidade;
    }
}
