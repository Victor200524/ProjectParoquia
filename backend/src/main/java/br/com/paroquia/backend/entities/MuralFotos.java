package br.com.paroquia.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "mural_Fotos")
public class MuralFotos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_muralFotos\"")
    private Long idMuralFotos;

    @Column(name = "\"titulo_muralFotos\"")
    private String tituloMuralFotos;

    @Column(name = "\"dataEvento_muralFotos\"")
    private Date dataEventoMuralFotos;

    // Forçando o TEXT para suportar links gigantes do Google Drive
    @Column(name = "\"linkDrive_muralFotos\"", columnDefinition = "TEXT")
    private String linkDriveMuralFotos;

    @ManyToOne
    @JoinColumn(name = "acampamento_id_acampamento", nullable = false)
    private Acampamento acampamento;

    public MuralFotos() {
        this(0L, "",null, "", null);
    }

    public MuralFotos(Long idMuralFotos, String tituloMuralFotos, Date dataEventoMuralFotos, String linkDriveMuralFotos, Acampamento acampamento) {
        this.idMuralFotos = idMuralFotos;
        this.tituloMuralFotos = tituloMuralFotos;
        this.dataEventoMuralFotos = dataEventoMuralFotos;
        this.linkDriveMuralFotos = linkDriveMuralFotos;
        this.acampamento = acampamento;
    }

    public Long getIdMuralFotos() {
        return idMuralFotos;
    }

    public void setIdMuralFotos(Long idMuralFotos) {
        this.idMuralFotos = idMuralFotos;
    }

    public String getTituloMuralFotos() {
        return tituloMuralFotos;
    }

    public void setTituloMuralFotos(String tituloMuralFotos) {
        this.tituloMuralFotos = tituloMuralFotos;
    }

    public Date getDataEventoMuralFotos() {
        return dataEventoMuralFotos;
    }

    public void setDataEventoMuralFotos(Date dataEventoMuralFotos) {
        this.dataEventoMuralFotos = dataEventoMuralFotos;
    }

    public String getLinkDriveMuralFotos() {
        return linkDriveMuralFotos;
    }

    public void setLinkDriveMuralFotos(String linkDriveMuralFotos) {
        this.linkDriveMuralFotos = linkDriveMuralFotos;
    }

    public Acampamento getAcampamento() {
        return acampamento;
    }

    public void setAcampamento(Acampamento acampamento) {
        this.acampamento = acampamento;
    }
}