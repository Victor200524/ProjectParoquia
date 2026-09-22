package br.com.paroquia.backend.entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "resposta")
public class Resposta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Resposta\"")
    private Long idResposta;

    @Column(name = "\"texto_Resposta\"")
    private String textoResposta;

    @Column(name = "\"data_Resposta\"")
    private Date dataResposta;

    @ManyToOne
    @JoinColumn(name = "pergunta_id_pergunta")
    private Pergunta pergunta;

    @ManyToOne
    @JoinColumn(name = "inscricao_id_inscricao")
    private InscricaoAcampamento inscricao;

    public Resposta() {
    }

    public Resposta(Long idResposta, String textoResposta, Date dataResposta, Pergunta pergunta, InscricaoAcampamento inscricao) {
        this.idResposta = idResposta;
        this.textoResposta = textoResposta;
        this.dataResposta = dataResposta;
        this.pergunta = pergunta;
        this.inscricao = inscricao;
    }

    public Long getIdResposta() {
        return idResposta;
    }

    public void setIdResposta(Long idResposta) {
        this.idResposta = idResposta;
    }

    public String getTextoResposta() {
        return textoResposta;
    }

    public void setTextoResposta(String textoResposta) {
        this.textoResposta = textoResposta;
    }

    public Date getDataResposta() {
        return dataResposta;
    }

    public void setDataResposta(Date dataResposta) {
        this.dataResposta = dataResposta;
    }

    public Pergunta getPergunta() {
        return pergunta;
    }

    public void setPergunta(Pergunta pergunta) {
        this.pergunta = pergunta;
    }

    public InscricaoAcampamento getInscricao() {
        return inscricao;
    }

    public void setInscricao(InscricaoAcampamento inscricao) {
        this.inscricao = inscricao;
    }
}
