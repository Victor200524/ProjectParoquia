package br.com.paroquia.backend.entities;

import br.com.paroquia.backend.enums.InscricaoAcampamentoStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscricao_acampamento")
public class InscricaoAcampamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Inscricao\"")
    private Long idInscricao;

    @Column(name = "\"funcao_Acampamento\"", nullable = false, length = 45)
    private String funcaoAcampamento;

    // Equipe em que o servo foi alocado pelo coordenador (fica vazio para campista e para servo ainda sem equipe)
    @Column(name = "\"equipe_Acampamento\"", length = 45)
    private String equipeAcampamento;

    @Column(name = "\"status_Aprovacao\"", nullable = false)
    @Enumerated(EnumType.STRING)
    private InscricaoAcampamentoStatus statusAprovacao;

    @Column(name = "\"data_Registro\"", nullable = false)
    private LocalDateTime dataRegistro;

    @ManyToOne
    @JoinColumn(name = "usuario_id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "acampamento_id_acampamento", nullable = false)
    private Acampamento acampamento;


    // Construtor padrão (obrigatório para o JPA)
    public InscricaoAcampamento() {
    }

    // Construtor completo
    public InscricaoAcampamento(Long idInscricao, String funcaoAcampamento, InscricaoAcampamentoStatus statusAprovacao,
                                LocalDateTime dataRegistro, Usuario usuario, Acampamento acampamento) {
        this.idInscricao = idInscricao;
        this.funcaoAcampamento = funcaoAcampamento;
        this.statusAprovacao = statusAprovacao;
        this.dataRegistro = dataRegistro;
        this.usuario = usuario;
        this.acampamento = acampamento;
    }

    public Long getIdInscricao() {
        return idInscricao;
    }

    public void setIdInscricao(Long idInscricao) {
        this.idInscricao = idInscricao;
    }

    public String getFuncaoAcampamento() {
        return funcaoAcampamento;
    }

    public void setFuncaoAcampamento(String funcaoAcampamento) {
        this.funcaoAcampamento = funcaoAcampamento;
    }

    public String getEquipeAcampamento() {
        return equipeAcampamento;
    }

    public void setEquipeAcampamento(String equipeAcampamento) {
        this.equipeAcampamento = equipeAcampamento;
    }

    public InscricaoAcampamentoStatus getStatusAprovacao() {
        return statusAprovacao;
    }

    public void setStatusAprovacao(InscricaoAcampamentoStatus statusAprovacao) {
        this.statusAprovacao = statusAprovacao;
    }

    public LocalDateTime getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDateTime dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Acampamento getAcampamento() {
        return acampamento;
    }

    public void setAcampamento(Acampamento acampamento) {
        this.acampamento = acampamento;
    }
}