package br.com.paroquia.backend.entities;
import br.com.paroquia.backend.enums.FormaPagamento;
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
    @Enumerated(EnumType.STRING)
    private FormaPagamento formaPagamento;

    @Column(name = "\"data_Pagamento\"")
    private LocalDateTime dataPagamento;

    @Column(name = "\"idMercadoPago_Pagamento\"")
    private String idMercadoPagoPagamento;

    @ManyToOne
    @JoinColumn(name = "inscricao_id_inscricao", nullable = false)
    private InscricaoAcampamento inscricaoAcampamento;

    public Pagamento() {
    }

    public Pagamento(Long idPagamento, Double valorPagamento, FormaPagamento formaPagamento, LocalDateTime dataPagamento, String idMercadoPagoPagamento, InscricaoAcampamento inscricaoAcampamento) {
        this.idPagamento = idPagamento;
        this.valorPagamento = valorPagamento;
        this.formaPagamento = formaPagamento;
        this.dataPagamento = dataPagamento;
        this.idMercadoPagoPagamento = idMercadoPagoPagamento;
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

    public FormaPagamento getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(FormaPagamento formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public LocalDateTime getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public String getIdMercadoPagoPagamento() {
        return idMercadoPagoPagamento;
    }

    public void setIdMercadoPagoPagamento(String idMercadoPagoPagamento) {
        this.idMercadoPagoPagamento = idMercadoPagoPagamento;
    }

    public InscricaoAcampamento getInscricaoAcampamento() {
        return inscricaoAcampamento;
    }

    public void setInscricaoAcampamento(InscricaoAcampamento inscricaoAcampamento) {
        this.inscricaoAcampamento = inscricaoAcampamento;
    }
}
