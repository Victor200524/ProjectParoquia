package br.com.paroquia.backend.entities;

import br.com.paroquia.backend.enums.CategoriaItemEstoque;
import br.com.paroquia.backend.enums.TipoItemEstoque;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "item_estoque")
public class ItemEstoque {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id_ItemEstoque\"")
    private Long idItemEstoque;

    @Column(name = "\"nome_ItemEstoque\"")
    private String nomeItemEstoque;

    @Column(name = "\"qtde_ItemEstoque\"")
    private Integer qtdeItemEstoque;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"categoria_ItemEstoque\"")
    private CategoriaItemEstoque categoriaItemEstoque;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"tipo_ItemEstoque\"")
    private TipoItemEstoque tipoItemEstoque;

    @Column(name = "\"dataValidade_ItemEstoque\"")
    private Date dataValidadeItemEstoque;

    public ItemEstoque() {
    }

    public ItemEstoque(Long idItemEstoque, String nomeItemEstoque, int qtdeItemEstoque, CategoriaItemEstoque categoriaItemEstoque, TipoItemEstoque tipoItemEstoque, Date dataValidadeItemEstoque) {
        this.idItemEstoque = idItemEstoque;
        this.nomeItemEstoque = nomeItemEstoque;
        this.qtdeItemEstoque = qtdeItemEstoque;
        this.categoriaItemEstoque = categoriaItemEstoque;
        this.tipoItemEstoque = tipoItemEstoque;
        this.dataValidadeItemEstoque = dataValidadeItemEstoque;
    }

    public Long getIdItemEstoque() {
        return idItemEstoque;
    }

    public void setIdItemEstoque(Long idItemEstoque) {
        this.idItemEstoque = idItemEstoque;
    }

    public String getNomeItemEstoque() {
        return nomeItemEstoque;
    }

    public void setNomeItemEstoque(String nomeItemEstoque) {
        this.nomeItemEstoque = nomeItemEstoque;
    }

    public Integer getQtdeItemEstoque() {
        return qtdeItemEstoque;
    }

    public void setQtdeItemEstoque(Integer qtdeItemEstoque) {
        this.qtdeItemEstoque = qtdeItemEstoque;
    }

    public CategoriaItemEstoque getCategoriaItemEstoque() {
        return categoriaItemEstoque;
    }

    public void setCategoriaItemEstoque(CategoriaItemEstoque categoriaItemEstoque) {
        this.categoriaItemEstoque = categoriaItemEstoque;
    }

    public TipoItemEstoque getTipoItemEstoque() {
        return tipoItemEstoque;
    }

    public void setTipoItemEstoque(TipoItemEstoque tipoItemEstoque) {
        this.tipoItemEstoque = tipoItemEstoque;
    }

    public Date getDataValidadeItemEstoque() {
        return dataValidadeItemEstoque;
    }

    public void setDataValidadeItemEstoque(Date dataValidadeItemEstoque) {
        this.dataValidadeItemEstoque = dataValidadeItemEstoque;
    }
}
