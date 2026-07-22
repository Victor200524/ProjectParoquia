package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.Acampamento;
import br.com.paroquia.backend.entities.ItemEstoque;
import br.com.paroquia.backend.entities.MovimentacaoEstoque;
import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.services.AcampamentoService;
import br.com.paroquia.backend.services.ItemEstoqueService;
import br.com.paroquia.backend.services.MovimentoEstoqueService;
import br.com.paroquia.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "movimentacaoEstoque")
public class MovimentoEstoqueRestControllers {
    @Autowired
    private MovimentoEstoqueService movimentoEstoqueService;
    @Autowired
    private ItemEstoqueService itemEstoqueService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private AcampamentoService acampamentoService;

    @GetMapping(value = "/todasMovimentacoes")
    public ResponseEntity<Object> getAllMovimentacoesEstoque(){
        List<MovimentacaoEstoque> movimentacaoEstoqueList = movimentoEstoqueService.getAllMovimentacoesEstoque();
        return !movimentacaoEstoqueList.isEmpty() ? ResponseEntity.status(HttpStatus.OK).body(movimentacaoEstoqueList):
                ResponseEntity.status(HttpStatus.OK).body("Não tem movimentações feitas no estoque!");
    }

    // Buscar pelo tipo
    @GetMapping(value = "/movimentacaoEstoqueTipo/{tipo}")
    public ResponseEntity<Object> getMovimentacaoEstoque(@PathVariable String tipo){
        try {
            List<MovimentacaoEstoque> movimentacaoEstoque = movimentoEstoqueService.temTipoMovimentoEstoque(tipo);
            if(!movimentacaoEstoque.isEmpty()){
                return ResponseEntity.status(HttpStatus.OK).body(movimentacaoEstoque);
            }
            return ResponseEntity.status(HttpStatus.OK).body("Nenhum(a) " + tipo.toUpperCase() + "de movimentacao encontrado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tipo de movimentação inválido. Use ENTRADA, SAIDA, etc.");
        }
    }

    // Buscar pelo usuario
    @GetMapping(value = "/movimentacaoEstoqueUsuario/{cpfusuario}")
    public ResponseEntity<Object> getMovimentacaoEstoqueUsuario(@PathVariable String cpfusuario){
        //Verificar se o usuario existe
        Usuario usuario = usuarioService.getCpfUsuario(cpfusuario);
        if(usuario != null){
            //verificar se aquele determinado usuario fez uma movimentacao naquele item em estoque
            List<MovimentacaoEstoque> movimentacaoEstoqueList = movimentoEstoqueService.temUsuarioMovimentacaoEstoque(usuario.getCpfUsuario());
            if(!movimentacaoEstoqueList.isEmpty()){
                return ResponseEntity.status(HttpStatus.OK).body(movimentacaoEstoqueList);
            }
            return ResponseEntity.status(HttpStatus.OK).body("Usuario " + usuario.getNomeUsuario() + "Nao fez movimentacoes no estoque");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario nao encontrado!");
    }

    // Buscar pelo acampamento
    @GetMapping(value = "/movimentacaoEstoqueAcampamento/{acampamento}")
    public ResponseEntity<Object> getMovimentacaoEstoqueAcampamento(@PathVariable String acampamento){
        // Verificaar se o acampamento existe
        Acampamento acampamento1 = acampamentoService.getNomeAcampamento(acampamento);
        if(acampamento1 != null){
            // Verificar se o acampamento tem alguma movimentacao no estoque
            List<MovimentacaoEstoque> movimentacaoEstoque =  movimentoEstoqueService.temAcampamentoMovimentacaoEstoque(acampamento1.getNomeAcampamento());
            if(!movimentacaoEstoque.isEmpty()){
                return ResponseEntity.status(HttpStatus.OK).body(movimentacaoEstoque);
            }
            return ResponseEntity.status(HttpStatus.OK).body("Acampamento " + acampamento1.getNomeAcampamento() + "Nao tem movimentacoes no estoque");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Acampamento nao encontrado!");
    }

    // Buscar pelo nome do item do estoque
    @GetMapping(value = "/movimentacaoEstoqueItemEstoque/{itemEstoque}")
    public ResponseEntity<Object> getMovimentacaoEstoqueItemEstoque(@PathVariable String itemEstoque){
        // Verificar se o item do estoque existe
        List<ItemEstoque> itemEstoque1 = itemEstoqueService.getItemEstoqueNome(itemEstoque);
        if(!itemEstoque1.isEmpty()){
            // Verificar houve movimentações no estoque para aquele ítem
            List<MovimentacaoEstoque> movimentacaoEstoqueList = movimentoEstoqueService.temItemEstoqueMovimentacaoEstoque(itemEstoque);
            if(!movimentacaoEstoqueList.isEmpty()){
                return ResponseEntity.status(HttpStatus.OK).body(movimentacaoEstoqueList);
            }
            return ResponseEntity.status(HttpStatus.OK).body("O item nao tem movimentacoes no estoque");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item do estoque nao encontrado!");
    }
}
