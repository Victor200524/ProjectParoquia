package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.ItemEstoque;
import br.com.paroquia.backend.repositories.ItemEstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemEstoqueService {
    @Autowired
    private ItemEstoqueRepository itemEstoqueRepository;

    public List<ItemEstoque> getAllItensEstoque() {
        return itemEstoqueRepository.findAll();
    }

    public ItemEstoque getItemEstoqueId(Long id){
        return itemEstoqueRepository.findById(id).orElse(null);
    }

    public List<ItemEstoque> getItemEstoqueNome(String nomeItem) {
        return itemEstoqueRepository.findByNomeItemEstoqueContainingIgnoreCase(nomeItem);
    }

    public ItemEstoque save(ItemEstoque itemEstoque) {
        return itemEstoqueRepository.save(itemEstoque);
    }

    public void deletarItemEstoque(ItemEstoque itemEstoque) {
        itemEstoqueRepository.delete(itemEstoque);
    }
}
