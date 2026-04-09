package br.com.paroquia.backend.entities;

import jakarta.persistence.*;
import jdk.jfr.Enabled;

@Enabled
@Table(name = "pastoral")
public class Pastoral {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Pastoral\"")
    private Long idPastoral;

    @Column(name = "\"nome_Pastoral\"")
    private String nomePastoral;

    public Pastoral() {
        this(0L, "");
    }

    public Pastoral(Long idPastoral, String nomePastoral) {
        this.idPastoral = idPastoral;
        this.nomePastoral = nomePastoral;
    }

    public Long getIdPastoral() {
        return idPastoral;
    }
    public void setIdPastoral(Long idPastoral) {
        this.idPastoral = idPastoral;
    }

    public String getNomePastoral() {
        return nomePastoral;
    }
    public void setNomePastoral(String nomePastoral) {
        this.nomePastoral = nomePastoral;
    }
}
