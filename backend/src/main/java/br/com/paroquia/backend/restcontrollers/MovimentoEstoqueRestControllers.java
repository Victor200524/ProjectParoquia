package br.com.paroquia.backend.restcontrollers;

import br.com.paroquia.backend.entities.Acampamento;
import br.com.paroquia.backend.entities.ItemEstoque;
import br.com.paroquia.backend.entities.MovimentacaoEstoque;
import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.enums.TipoMovimentacaoEstoque;
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

    private ItemEstoque itemEstoque;

    @GetMapping(value = "/todasMovimentacoes")
    public ResponseEntity<Object> getAllMovimentacoesEstoque(){
        List<MovimentacaoEstoque> movimentacaoEstoqueList = movimentoEstoqueService.getAllMovimentacoesEstoque();
        return !movimentacaoEstoqueList.isEmpty() ? ResponseEntity.status(HttpStatus.OK).body(movimentacaoEstoqueList):
                ResponseEntity.status(HttpStatus.OK).body("Não tem movimentações feitas no estoque!");
    }

// =========================== BUSCAS ESPECIFICAS ===================================================== \\
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
// =========================== BUSCAS ESPECIFICAS ===================================================== \\

    @PostMapping(value = "/gravarMovimentoEstoque")
    public ResponseEntity<Object> gravarMovimentoEstoque(@RequestBody MovimentacaoEstoque movimentacaoEstoque){
        if(movimentacaoEstoque != null){
            movimentoEstoqueService.gravarMovimentoEstoque(movimentacaoEstoque);
            return ResponseEntity.status(HttpStatus.OK).body("Movimentacao cadastrada com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dados insuficientes para cadastro!");
    }

    @PutMapping(value = "/alterarMovimentoEstoque/{id}")
    public ResponseEntity<Object> alterarMovimentoEstoque(@PathVariable Long id, @RequestBody MovimentacaoEstoque novaMovimentacaoEstoque) {
        MovimentacaoEstoque movimentacaoEstoqueAntiga = movimentoEstoqueService.getMovimentacaoEstoqueId(id);
        if (movimentacaoEstoqueAntiga != null) {
            if (novaMovimentacaoEstoque != null) {
                ItemEstoque itemEstoque = itemEstoqueService.getItemEstoqueId(novaMovimentacaoEstoque.getItemEstoque().getIdItemEstoque());
                // ==========================================
                // BLOCO DE ENTRADA
                // ==========================================
                if (novaMovimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.ENTRADA) {
                    if (novaMovimentacaoEstoque.getQtdeMovimentacaoEstoque() <= 0) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A quantidade da entrada deve ser maior que zero!");
                    }
                    int novoSaldo = itemEstoque.getQtdeItemEstoque() - movimentacaoEstoqueAntiga.getQtdeMovimentacaoEstoque() + novaMovimentacaoEstoque.getQtdeMovimentacaoEstoque();
                    itemEstoque.setQtdeItemEstoque(novoSaldo);
                    itemEstoqueService.save(itemEstoque);
                    novaMovimentacaoEstoque.setIdMovimentacaoEstoque(id);
                    movimentoEstoqueService.gravarMovimentoEstoque(novaMovimentacaoEstoque);
                    return ResponseEntity.status(HttpStatus.OK).body("Movimento de entrada alterado com sucesso!");
                }

                // ==========================================
                // BLOCO DE SAÍDA OU PERDA
                // ==========================================
                else if (novaMovimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.SAIDA || novaMovimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.PERDA_VALIDADE) {
                    if (novaMovimentacaoEstoque.getQtdeMovimentacaoEstoque() <= 0) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A quantidade deve ser maior que zero!");
                    }
                    int estoqueReal = itemEstoque.getQtdeItemEstoque();
                    if (movimentacaoEstoqueAntiga.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.ENTRADA) {
                        estoqueReal = estoqueReal - movimentacaoEstoqueAntiga.getQtdeMovimentacaoEstoque();
                    }
                    else if (movimentacaoEstoqueAntiga.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.SAIDA || movimentacaoEstoqueAntiga.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.PERDA_VALIDADE) {
                        estoqueReal = estoqueReal + movimentacaoEstoqueAntiga.getQtdeMovimentacaoEstoque();
                    }
                    if (novaMovimentacaoEstoque.getQtdeMovimentacaoEstoque() > estoqueReal) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantidade insuficiente no estoque!");
                    }
                    itemEstoque.setQtdeItemEstoque(estoqueReal - novaMovimentacaoEstoque.getQtdeMovimentacaoEstoque());
                    itemEstoqueService.save(itemEstoque);
                    novaMovimentacaoEstoque.setIdMovimentacaoEstoque(id);
                    movimentoEstoqueService.gravarMovimentoEstoque(novaMovimentacaoEstoque);
                    return ResponseEntity.status(HttpStatus.OK).body("Movimento de " + novaMovimentacaoEstoque.getTipoMovimentacaoEstoque() + " alterado com sucesso!");
                }

                // ==========================================
                // BLOCO DE TRANSFERÊNCIA
                // ==========================================
                else {
                    if (novaMovimentacaoEstoque.getQtdeMovimentacaoEstoque() <= 0) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A quantidade deve ser maior que zero!");
                    }
                    int estoqueReal = itemEstoque.getQtdeItemEstoque();
                    if (movimentacaoEstoqueAntiga.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.ENTRADA) {
                        estoqueReal = estoqueReal - movimentacaoEstoqueAntiga.getQtdeMovimentacaoEstoque();
                    }
                    else if (movimentacaoEstoqueAntiga.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.SAIDA || movimentacaoEstoqueAntiga.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.PERDA_VALIDADE) {
                        estoqueReal = estoqueReal + movimentacaoEstoqueAntiga.getQtdeMovimentacaoEstoque();
                    }
                    if (novaMovimentacaoEstoque.getAcampamento() != null && novaMovimentacaoEstoque.getAcampamentoDestino() != null) {
                        if (novaMovimentacaoEstoque.getQtdeMovimentacaoEstoque() > estoqueReal) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantidade insuficiente no estoque central!");
                        }
                        itemEstoque.setQtdeItemEstoque(estoqueReal);
                        itemEstoqueService.save(itemEstoque);
                        novaMovimentacaoEstoque.setIdMovimentacaoEstoque(id);
                        movimentoEstoqueService.gravarMovimentoEstoque(novaMovimentacaoEstoque);
                        return ResponseEntity.status(HttpStatus.OK).body("Movimento de " + novaMovimentacaoEstoque.getTipoMovimentacaoEstoque() + " alterado com sucesso!");
                    }
                    else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Acampamento de Origem e Destino são obrigatórios para transferência!");
                    }
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dados da nova movimentação estão faltando!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movimento de estoque não existe!");
    }
}

