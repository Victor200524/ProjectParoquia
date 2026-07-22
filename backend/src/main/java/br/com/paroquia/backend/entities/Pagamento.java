package br.com.paroquia.backend.entities;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pagamento")
public class Pagamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_Pagamento\"")
    private Long idPagamento;

    @Column(name = "\"valor_Pagamento\"")
    private Double valorPagamento;

    @Column(name = "\"forma_Pagamento\"")
    private String formaPagamento;

    @Column(name = "\"status_Pagamento\"")
    private int statusPagamento;

    @ManyToOne
    @JoinColumn(name = "inscricao_id_inscricao", nullable = false)
    private InscricaoAcampamento inscricaoAcampamento;

    public Pagamento() {
    }

    public Pagamento(Long idPagamento, Double valorPagamento, String formaPagamento, int statusPagamento, InscricaoAcampamento inscricaoAcampamento) {
        this.idPagamento = idPagamento;
        this.valorPagamento = valorPagamento;
        this.formaPagamento = formaPagamento;
        this.statusPagamento = statusPagamento;
        this.inscricaoAcampamento = inscricaoAcampamento;
    }

    public Long getIdPagamento() {
        return idPagamento;
    }

    public void setIdPagamento(Long idPagamento) {
        this.idPagamento = idPagamento;
    }

    public Double getValorPagamento() {
        return valorPagamento;
    }

    public void setValorPagamento(Double valorPagamento) {
        this.valorPagamento = valorPagamento;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public int getStatusPagamento() {
        return statusPagamento;
    }

    public void setStatusPagamento(int statusPagamento) {
        this.statusPagamento = statusPagamento;
    }

    public InscricaoAcampamento getInscricaoAcampamento() {
        return inscricaoAcampamento;
    }

    public void setInscricaoAcampamento(InscricaoAcampamento inscricaoAcampamento) {
        this.inscricaoAcampamento = inscricaoAcampamento;
    }
}
