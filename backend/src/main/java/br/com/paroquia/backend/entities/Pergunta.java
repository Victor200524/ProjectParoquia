package br.com.paroquia.backend.entities;

import br.com.paroquia.backend.enums.CondicaoPergunta;
import br.com.paroquia.backend.enums.TipoPergunta;
import jakarta.persistence.*;

@Entity
@Table(name = "pergunta")
public class Pergunta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Pergunta\"")
    private Long idPergunta;

    @Column(name = "\"texto_Pergunta\"")
    private String textoPergunta;

    @Column(name = "\"tipo_Pergunta\"")
    @Enumerated(EnumType.STRING)
    private TipoPergunta tipoPergunta;

    @Column(name = "\"condicao_Pergunta\"")
    @Enumerated(EnumType.STRING)
    private CondicaoPergunta condicaoPergunta;

    @ManyToOne
    @JoinColumn(name = "formulario_id_formulario")
    private Formulario formulario;

    public Pergunta() {
    }

    public Pergunta(Long idPergunta, String textoPergunta, TipoPergunta tipoPergunta, CondicaoPergunta condicaoPergunta, Formulario formulario) {
        this.idPergunta = idPergunta;
        this.textoPergunta = textoPergunta;
        this.tipoPergunta = tipoPergunta;
        this.condicaoPergunta = condicaoPergunta;
        this.formulario = formulario;
    }

    public Long getIdPergunta() {
        return idPergunta;
    }

    public void setIdPergunta(Long idPergunta) {
        this.idPergunta = idPergunta;
    }

    public String getTextoPergunta() {
        return textoPergunta;
    }

    public void setTextoPergunta(String textoPergunta) {
        this.textoPergunta = textoPergunta;
    }

    public TipoPergunta getTipoPergunta() {
        return tipoPergunta;
    }

    public void setTipoPergunta(TipoPergunta tipoPergunta) {
        this.tipoPergunta = tipoPergunta;
    }

    public CondicaoPergunta getCondicaoPergunta() {
        return condicaoPergunta;
    }

    public void setCondicaoPergunta(CondicaoPergunta condicaoPergunta) {
        this.condicaoPergunta = condicaoPergunta;
    }

    public Formulario getFormulario() {
        return formulario;
    }

    public void setFormulario(Formulario formulario) {
        this.formulario = formulario;
    }
}
