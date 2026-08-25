package br.com.paroquia.backend.entities;

import br.com.paroquia.backend.enums.TipoDoacao;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "doacao")
public class Doacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Doacao\"")
    private Long idDoacao;

    @Column(name = "\"nome_Doacao\"")
    private String nomeDoacao;

    @Column(name = "\"descricao_Doacao\"")
    private String descricaoDoacao;

    @Column(name = "\"nomeDoador_Doacao\"")
    private String nomeDoador;

    @Column(name = "\"data_Doacao\"")
    private Date dataDoacao;

    @Column(name = "\"dataValidade_Doacao\"")
    private Date dataValidadeDoacao;

    @Column(name = "\"tipo_Doacao\"")
    @Enumerated(EnumType.STRING)
    private TipoDoacao tipoDoacao;

    @Column(name = "\"qtde_Doacao\"")
    private Integer qtdeDoacao;

    @ManyToOne
    @JoinColumn(name = "acampamento_id_acampamento")
    private Acampamento acampamento;

    public Doacao() {
    }

    public Doacao(Long idDoacao, String nomeDoacao ,String descricaoDoacao, String nomeDoador, Date dataDoacao, Date dataValidadeDoacao, TipoDoacao tipoDoacao, Integer qtdeDoacao, Acampamento acampamento) {
        this.idDoacao = idDoacao;
        this.nomeDoacao = nomeDoacao;
        this.descricaoDoacao = descricaoDoacao;
        this.nomeDoador = nomeDoador;
        this.dataDoacao = dataDoacao;
        this.dataValidadeDoacao = dataValidadeDoacao;
        this.tipoDoacao = tipoDoacao;
        this.qtdeDoacao = qtdeDoacao;
        this.acampamento = acampamento;
    }

    public Long getIdDoacao() {
        return idDoacao;
    }

    public void setIdDoacao(Long idDoacao) {
        this.idDoacao = idDoacao;
    }

    public String getNomeDoacao() {
        return nomeDoacao;
    }

    public void setNomeDoacao(String nomeDoacao) {
        this.nomeDoacao = nomeDoacao;
    }

    public String getDescricaoDoacao() {
        return descricaoDoacao;
    }

    public void setDescricaoDoacao(String descricaoDoacao) {
        this.descricaoDoacao = descricaoDoacao;
    }

    public String getNomeDoador() {
        return nomeDoador;
    }

    public void setNomeDoador(String nomeDoador) {
        this.nomeDoador = nomeDoador;
    }

    public Date getDataDoacao() {
        return dataDoacao;
    }

    public void setDataDoacao(Date dataDoacao) {
        this.dataDoacao = dataDoacao;
    }

    public Date getDataValidadeDoacao() {
        return dataValidadeDoacao;
    }

    public void setDataValidadeDoacao(Date dataValidadeDoacao) {
        this.dataValidadeDoacao = dataValidadeDoacao;
    }

    public TipoDoacao getTipoDoacao() {
        return tipoDoacao;
    }

    public void setTipoDoacao(TipoDoacao tipoDoacao) {
        this.tipoDoacao = tipoDoacao;
    }

    public Integer getQtdeDoacao() {
        return qtdeDoacao;
    }

    public void setQtdeDoacao(Integer qtdeDoacao) {
        this.qtdeDoacao = qtdeDoacao;
    }

    public Acampamento getAcampamento() {
        return acampamento;
    }

    public void setAcampamento(Acampamento acampamento) {
        this.acampamento = acampamento;
    }
}
