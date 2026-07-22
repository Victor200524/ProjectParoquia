package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.ItemEstoque;
import br.com.paroquia.backend.services.ItemEstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/itemEstoque")
public class ItemEstoqueRestControllers {

    @Autowired
    private ItemEstoqueService itemEstoqueService;

    // Retorna todos os itens em estoque
    @GetMapping(value = "/getAllItensEstoque")
    public ResponseEntity<Object> getAllItensEstoque(){
        List<ItemEstoque> itemEstoqueList = itemEstoqueService.getAllItensEstoque();
        return itemEstoqueList != null ? ResponseEntity.ok(itemEstoqueList) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum item em estoque cadastrado");
    }

    // Retorna o item em estoque pelo seu nome
    @GetMapping(value = "/buscarItemEstoque/{nomeItem}")
    public ResponseEntity<Object> getItemEstoque(@PathVariable String nomeItem){
        return !itemEstoqueService.getItemEstoqueNome(nomeItem).isEmpty() ?
                ResponseEntity.ok(itemEstoqueService.getItemEstoqueNome(nomeItem)) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item zem estoque nao encontrado");
    }

    @PostMapping(value = "/gravarItemEstoque")
    public ResponseEntity<Object> gravarItemEstoque(@RequestBody ItemEstoque itemEstoque){
        if(itemEstoque != null){
            ItemEstoque novoItemEstoque = itemEstoqueService.save(itemEstoque);
            return ResponseEntity.status(HttpStatus.CREATED).body("Item cadastrado com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dados insuficientes para cadastro!");
    }

    @PutMapping(value = "/atualizarItemEstoque")
    public ResponseEntity<Object> atualizarItemEstoque(@RequestBody ItemEstoque itemEstoque){
        if(itemEstoque != null){
            ItemEstoque itemAtualizado = itemEstoqueService.save(itemEstoque);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Item atualizado com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Falta informações para atualizar o item em estoque!");
    }

    @DeleteMapping(value = "/deletarItemEstoque/{id}")
    public ResponseEntity<Object> deletarItemEstoque(@PathVariable Long id){
        if(id != null){
            ItemEstoque itemEstoque = itemEstoqueService.getItemEstoqueId(id);
            if(itemEstoque != null){
                ItemEstoque aux = itemEstoque;
                itemEstoqueService.deletarItemEstoque(itemEstoque);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body("Item " + aux.getNomeItemEstoque() + "deletado com sucesso!");
            }
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Item em estoque nao cadastrado!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item em estoque nao foi encontrado!");
    }
}
