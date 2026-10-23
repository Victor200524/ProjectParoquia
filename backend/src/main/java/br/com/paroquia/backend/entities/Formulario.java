package br.com.paroquia.backend.entities;

import br.com.paroquia.backend.enums.TipoFormulario;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "formulario")
public class Formulario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Formulario\"")
    private Long idFormulario;

    @Column(name = "\"titulo_Formulario\"")
    private String tituloFormulario;

    @Column(name = "\"tipo_Formulario\"")
    @Enumerated(EnumType.STRING)
    private TipoFormulario tipoFormulario;

    @Column(name = "\"dataInicio_Formulario\"")
    private Date dataInicioFormulario;

    @Column(name = "\"dataFim_Formulario\"")
    private Date dataFimFormulario;

    @Column(name = "\"capacidade_Formulario\"")
    private Integer capacidadeFormulario; // quantas pessoas podem se inscrever por este formulário

    @ManyToOne
    @JoinColumn(name = "acampamento_id_acampamento")
    private Acampamento acampamento;

    // Não vira coluna no banco: é calculado na hora pelo controller para a tela saber se esgotou
    @Transient
    private Long totalInscritos;

    public Formulario() {
    }

    public Formulario(Long idFormulario, String tituloFormulario, TipoFormulario tipoFormulario, Date dataInicioFormulario, Date dataFimFormulario, Integer capacidadeFormulario, Acampamento acampamento) {
        this.idFormulario = idFormulario;
        this.tituloFormulario = tituloFormulario;
        this.tipoFormulario = tipoFormulario;
        this.dataInicioFormulario = dataInicioFormulario;
        this.dataFimFormulario = dataFimFormulario;
        this.capacidadeFormulario = capacidadeFormulario;
        this.acampamento = acampamento;
    }

    public Long getIdFormulario() {
        return idFormulario;
    }

    public void setIdFormulario(Long idFormulario) {
        this.idFormulario = idFormulario;
    }

    public String getTituloFormulario() {
        return tituloFormulario;
    }

    public void setTituloFormulario(String tituloFormulario) {
        this.tituloFormulario = tituloFormulario;
    }

    public TipoFormulario getTipoFormulario() {
        return tipoFormulario;
    }

    public void setTipoFormulario(TipoFormulario tipoFormulario) {
        this.tipoFormulario = tipoFormulario;
    }

    public Date getDataInicioFormulario() {
        return dataInicioFormulario;
    }

    public void setDataInicioFormulario(Date dataInicioFormulario) {
        this.dataInicioFormulario = dataInicioFormulario;
    }

    public Date getDataFimFormulario() {
        return dataFimFormulario;
    }

    public void setDataFimFormulario(Date dataFimFormulario) {
        this.dataFimFormulario = dataFimFormulario;
    }

    public Integer getCapacidadeFormulario() {
        return capacidadeFormulario;
    }

    public void setCapacidadeFormulario(Integer capacidadeFormulario) {
        this.capacidadeFormulario = capacidadeFormulario;
    }

    public Acampamento getAcampamento() {
        return acampamento;
    }

    public void setAcampamento(Acampamento acampamento) {
        this.acampamento = acampamento;
    }

    public Long getTotalInscritos() {
        return totalInscritos;
    }

    public void setTotalInscritos(Long totalInscritos) {
        this.totalInscritos = totalInscritos;
    }
}
