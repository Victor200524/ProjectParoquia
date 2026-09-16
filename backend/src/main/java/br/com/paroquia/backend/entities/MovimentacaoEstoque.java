package br.com.paroquia.backend.entities;


import br.com.paroquia.backend.enums.TipoMovimentacaoEstoque;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "movimentacao_estoque")
public class MovimentacaoEstoque {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_MovEstoque\"")
    private Long idMovimentacaoEstoque;

    @Column(name = "\"tipoMovimentacao_MovEstoque\"")
    @Enumerated(EnumType.STRING)
    private TipoMovimentacaoEstoque tipoMovimentacaoEstoque;

    @Column(name = "\"qtdeMovimentacao_MovEstoque\"")
    private Integer qtdeMovimentacaoEstoque;

    @Column(name = "\"dataMovimentacao_MovEstoque\"")
    private LocalDateTime dataMovimentacaoEstoque;

    @Column(name = "\"observacao_MovEstoque\"")
    private String obsMovimentacaoEstoque;

    @ManyToOne
    @JoinColumn(name = "itemestoque_id_itemestoque")
    private ItemEstoque itemEstoque;

    @ManyToOne
    @JoinColumn(name = "usuario_id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "acampamento_id_acampamento")
    private Acampamento acampamento;

    @ManyToOne
    @JoinColumn(name = "AcampamentoDestino_id_Acampamento")
    private Acampamento acampamentoDestino;

    public MovimentacaoEstoque() {
    }

    public MovimentacaoEstoque(Long idMovimentacaoEstoque, TipoMovimentacaoEstoque tipoMovimentacaoEstoque, Integer qtdeMovimentacaoEstoque, LocalDateTime dataMovimentacaoEstoque, String obsMovimentacaoEstoque, ItemEstoque itemEstoque, Usuario usuario, Acampamento acampamento, Acampamento acampamentoDestino) {
        this.idMovimentacaoEstoque = idMovimentacaoEstoque;
        this.tipoMovimentacaoEstoque = tipoMovimentacaoEstoque;
        this.qtdeMovimentacaoEstoque = qtdeMovimentacaoEstoque;
        this.dataMovimentacaoEstoque = dataMovimentacaoEstoque;
        this.obsMovimentacaoEstoque = obsMovimentacaoEstoque;
        this.itemEstoque = itemEstoque;
        this.usuario = usuario;
        this.acampamento = acampamento;
        this.acampamentoDestino = null;
    }

    public Long getIdMovimentacaoEstoque() {
        return idMovimentacaoEstoque;
    }

    public void setIdMovimentacaoEstoque(Long idMovimentacaoEstoque) {
        this.idMovimentacaoEstoque = idMovimentacaoEstoque;
    }

    public TipoMovimentacaoEstoque getTipoMovimentacaoEstoque() {
        return tipoMovimentacaoEstoque;
    }

    public void setTipoMovimentacaoEstoque(TipoMovimentacaoEstoque tipoMovimentacaoEstoque) {
        this.tipoMovimentacaoEstoque = tipoMovimentacaoEstoque;
    }

    public Integer getQtdeMovimentacaoEstoque() {
        return qtdeMovimentacaoEstoque;
    }

    public void setQtdeMovimentacaoEstoque(Integer qtdeMovimentacaoEstoque) {
        this.qtdeMovimentacaoEstoque = qtdeMovimentacaoEstoque;
    }

    public LocalDateTime getDataMovimentacaoEstoque() {
        return dataMovimentacaoEstoque;
    }

    public void setDataMovimentacaoEstoque(LocalDateTime dataMovimentacaoEstoque) {
        this.dataMovimentacaoEstoque = dataMovimentacaoEstoque;
    }

    public String getObsMovimentacaoEstoque() {
        return obsMovimentacaoEstoque;
    }

    public void setObsMovimentacaoEstoque(String obsMovimentacaoEstoque) {
        this.obsMovimentacaoEstoque = obsMovimentacaoEstoque;
    }

    public ItemEstoque getItemEstoque() {
        return itemEstoque;
    }

    public void setItemEstoque(ItemEstoque itemEstoque) {
        this.itemEstoque = itemEstoque;
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

    public Acampamento getAcampamentoDestino() {
        return acampamentoDestino;
    }

    public void setAcampamentoDestino(Acampamento acampamentoDestino) {
        this.acampamentoDestino = acampamentoDestino;
    }
}
