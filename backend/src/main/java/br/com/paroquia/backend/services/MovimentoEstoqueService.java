package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.MovimentacaoEstoque;
import br.com.paroquia.backend.repositories.ItemEstoqueRepository;
import br.com.paroquia.backend.repositories.MovimentacaoEstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovimentoEstoqueService {
    @Autowired
    MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    @Autowired
    ItemEstoqueRepository itemEstoqueRepository;

    public List<MovimentacaoEstoque> getAllMovimentacoesEstoque() {
        return movimentacaoEstoqueRepository.findAll();
    }

    public List<MovimentacaoEstoque> temUsuarioMovimentacaoEstoque(String cpfUsuario) {
        return movimentacaoEstoqueRepository.findByUsuarioCpfUsuarioContainingIgnoreCase(cpfUsuario);
    }

    public List<MovimentacaoEstoque> temAcampamentoMovimentacaoEstoque(String nomeAcampamento) {
        return movimentacaoEstoqueRepository.findByAcampamentoNomeAcampamentoContainingIgnoreCase(nomeAcampamento);
    }

    public List<MovimentacaoEstoque> temItemEstoqueMovimentacaoEstoque(String itemEstoque) {
        return movimentacaoEstoqueRepository.findByItemEstoqueNomeItemEstoqueContainingIgnoreCase(itemEstoque);
    }

    public List<MovimentacaoEstoque> temTipoMovimentoEstoque(String tipo) {
        return movimentacaoEstoqueRepository.findByTipoMovimentacaoEstoqueContainingIgnoreCase(tipo);
    }
}
