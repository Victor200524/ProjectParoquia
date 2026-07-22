package br.com.paroquia.backend.repositories;


import br.com.paroquia.backend.entities.ItemEstoque;
import br.com.paroquia.backend.enums.CategoriaItemEstoque;
import br.com.paroquia.backend.enums.TipoItemEstoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemEstoqueRepository extends JpaRepository<ItemEstoque, Long> {

    // Esse "IgnoreCase" ignora as letras maísculas/minusculas
    List<ItemEstoque> findByNomeItemEstoqueContainingIgnoreCase(String nomeItem);
    // Busca todos os itens de uma categoria específica (Ex: COZINHA)
    List<ItemEstoque> findByCategoriaItemEstoque(CategoriaItemEstoque categoria);
    // Busca todos os itens perecíveis (ou não perecíveis)
    List<ItemEstoque> findByTipoItemEstoque(TipoItemEstoque tipo);

}
