package br.com.paroquia.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "horario_missa")
public class HorarioMissa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_HorarioMissa\"")
    private Long idHorarioMissa;

    @Column(name = "\"semana_Missa\"")
    private String semanaMissa;

    @Column(name = "\"horario_Missa\"")
    private String horarioMissa;

    // Relacionamento N:1 com Comunidade
    @ManyToOne
    @JoinColumn(name = "comunidade_id_comunidade")
    @JsonIgnore
    private Comunidade comunidade;

    public HorarioMissa() {
    }

    public HorarioMissa(Long idHorarioMissa, String semanaMissa, String horarioMissa) {
        this.idHorarioMissa = idHorarioMissa;
        this.semanaMissa = semanaMissa;
        this.horarioMissa = horarioMissa;
    }

    public Long getIdHorarioMissa() {
        return idHorarioMissa;
    }

    public void setIdHorarioMissa(Long idHorarioMissa) {
        this.idHorarioMissa = idHorarioMissa;
    }

    public String getSemanaMissa() {
        return semanaMissa;
    }

    public void setSemanaMissa(String semanaMissa) {
        this.semanaMissa = semanaMissa;
    }

    public String getHorarioMissa() {
        return horarioMissa;
    }

    public void setHorarioMissa(String horarioMissa) {
        this.horarioMissa = horarioMissa;
    }

    public Comunidade getComunidade() {
        return comunidade;
    }

    public void setComunidade(Comunidade comunidade) {
        this.comunidade = comunidade;
    }
}