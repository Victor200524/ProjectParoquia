package br.com.paroquia.backend.entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "acampamento")
public class Acampamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Acampamento\"")
    private Long idAcampamento;

    @Column(name = "\"nome_Acampamento\"")
    private String nomeAcampamento;

    @Column(name = "\"local_Acampamento\"")
    private String localAcampamento;

    @Column(name = "\"idadeMinima_Acampamento\"")
    private Integer idadeMinAcampamento;

    @Column(name = "\"idadeMaxima_Acampamento\"")
    private Integer idadeMaxAcampamento;

    @Column(name = "\"taxaInscricao_Acampamento\"")
    private Double taxaInscricaoAcampamento;

    @Column(name = "\"vagas_Acampamento\"")
    private Integer vagasAcampamento;

    @Column(name = "\"dataInicio_Acampamento\"")
    private Date dataInicioAcampamento;

    @Column(name = "\"dataFim_Acampamento\"")
    private Date dataFimAcampamento;

    @Column(name = "\"informacoes_Acampamento\"", columnDefinition = "TEXT")
    private String informacoesAcampamento;

    @Column(name = "\"foto_Acampamento\"", columnDefinition = "TEXT")
    private String fotoAcampamento;

    @ManyToOne
    @JoinColumn(name = "usuario_id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "comunidade_id_comunidade", nullable = false)
    private Comunidade comunidade;

    public Acampamento() {
        this(0L,"","",0,0,0.0,0,null,null,"","",null,null);
    }

    public Acampamento(Long idAcampamento, String nomeAcampamento, String localAcampamento, Integer idadeMinAcampamento, Integer idadeMaxAcampamento, Double taxaInscricaoAcampamento, Integer vagasAcampamento, Date dataInicioAcampamento, Date dataFimAcampamento, String informacoesAcampamento, String fotoAcampamento, Usuario usuario, Comunidade comunidade) {
        this.idAcampamento = idAcampamento;
        this.nomeAcampamento = nomeAcampamento;
        this.localAcampamento = localAcampamento;
        this.idadeMinAcampamento = idadeMinAcampamento;
        this.idadeMaxAcampamento = idadeMaxAcampamento;
        this.taxaInscricaoAcampamento = taxaInscricaoAcampamento;
        this.vagasAcampamento = vagasAcampamento;
        this.dataInicioAcampamento = dataInicioAcampamento;
        this.dataFimAcampamento = dataFimAcampamento;
        this.informacoesAcampamento = informacoesAcampamento;
        this.fotoAcampamento = fotoAcampamento;
        this.usuario = usuario;
        this.comunidade = comunidade;
    }

    public Long getIdAcampamento() {
        return idAcampamento;
    }

    public void setIdAcampamento(Long idAcampamento) {
        this.idAcampamento = idAcampamento;
    }

    public String getNomeAcampamento() {
        return nomeAcampamento;
    }

    public void setNomeAcampamento(String nomeAcampamento) {
        this.nomeAcampamento = nomeAcampamento;
    }

    public String getLocalAcampamento() {
        return localAcampamento;
    }

    public void setLocalAcampamento(String localAcampamento) {
        this.localAcampamento = localAcampamento;
    }

    public Integer getIdadeMinAcampamento() {
        return idadeMinAcampamento;
    }

    public void setIdadeMinAcampamento(Integer idadeMinAcampamento) {
        this.idadeMinAcampamento = idadeMinAcampamento;
    }

    public Integer getIdadeMaxAcampamento() {
        return idadeMaxAcampamento;
    }

    public void setIdadeMaxAcampamento(Integer idadeMaxAcampamento) {
        this.idadeMaxAcampamento = idadeMaxAcampamento;
    }

    public Double getTaxaInscricaoAcampamento() {
        return taxaInscricaoAcampamento;
    }

    public void setTaxaInscricaoAcampamento(Double taxaInscricaoAcampamento) {
        this.taxaInscricaoAcampamento = taxaInscricaoAcampamento;
    }

    public Integer getVagasAcampamento() {
        return vagasAcampamento;
    }

    public void setVagasAcampamento(Integer vagasAcampamento) {
        this.vagasAcampamento = vagasAcampamento;
    }

    public Date getDataInicioAcampamento() {
        return dataInicioAcampamento;
    }

    public void setDataInicioAcampamento(Date dataInicioAcampamento) {
        this.dataInicioAcampamento = dataInicioAcampamento;
    }

    public Date getDataFimAcampamento() {
        return dataFimAcampamento;
    }

    public void setDataFimAcampamento(Date dataFimAcampamento) {
        this.dataFimAcampamento = dataFimAcampamento;
    }

    public String getInformacoesAcampamento() {
        return informacoesAcampamento;
    }

    public void setInformacoesAcampamento(String informacoesAcampamento) {
        this.informacoesAcampamento = informacoesAcampamento;
    }

    public String getFotoAcampamento() {
        return fotoAcampamento;
    }

    public void setFotoAcampamento(String fotoAcampamento) {
        this.fotoAcampamento = fotoAcampamento;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Comunidade getComunidade() {
        return comunidade;
    }

    public void setComunidade(Comunidade comunidade) {
        this.comunidade = comunidade;
    }
}
