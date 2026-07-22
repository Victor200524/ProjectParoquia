package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {
    List<MovimentacaoEstoque> findByUsuarioCpfUsuarioContainingIgnoreCase(String cpf);

    List<MovimentacaoEstoque> findByAcampamentoNomeAcampamentoContainingIgnoreCase(String nomeAcampamento);

    List<MovimentacaoEstoque> findByItemEstoqueNomeItemEstoqueContainingIgnoreCase(String itemEstoque);

    List<MovimentacaoEstoque> findByTipoMovimentacaoEstoqueContainingIgnoreCase(String tipo);
}
