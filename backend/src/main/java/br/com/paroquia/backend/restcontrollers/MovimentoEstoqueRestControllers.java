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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

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

    @Transactional
    @PostMapping(value = "/gravarMovimentoEstoque")
    public ResponseEntity<Object> gravarMovimentoEstoque(@RequestBody MovimentacaoEstoque movimentacaoEstoque){
        try {
        if(movimentacaoEstoque != null){
            ItemEstoque itemEstoque = itemEstoqueService.getItemEstoqueId(movimentacaoEstoque.getItemEstoque().getIdItemEstoque()); // Procuro o item, se realmente existe
            if(itemEstoque != null){
                if(movimentacaoEstoque.getQtdeMovimentacaoEstoque() > 0) {

                    // ==========================================
                    // BLOCO DE ENTRADA
                    // ==========================================
                    if (movimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.ENTRADA) {
                        itemEstoque.setQtdeItemEstoque(itemEstoque.getQtdeItemEstoque() + movimentacaoEstoque.getQtdeMovimentacaoEstoque()); // Faço a somatoria da quantidade atual com a de entrada
                        itemEstoqueService.save(itemEstoque);
                        movimentoEstoqueService.gravarMovimentoEstoque(movimentacaoEstoque);
                        return ResponseEntity.status(HttpStatus.OK).body("Movimentacao de ENTRADA cadastrada com sucesso!");
                    }

                    // ==========================================
                    // BLOCO DE SAÍDA OU PERDA
                    // ==========================================
                    else if (movimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.SAIDA || movimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.PERDA_VALIDADE) {
                        if (movimentacaoEstoque.getQtdeMovimentacaoEstoque() > itemEstoque.getQtdeItemEstoque())
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantidade insuficiente no estoque para realizar esta saída!");
                        int novaQtde = itemEstoque.getQtdeItemEstoque() - movimentacaoEstoque.getQtdeMovimentacaoEstoque();
                        itemEstoque.setQtdeItemEstoque(novaQtde);
                        itemEstoqueService.save(itemEstoque);
                        movimentoEstoqueService.gravarMovimentoEstoque(movimentacaoEstoque);
                        return ResponseEntity.status(HttpStatus.OK).body("Movimentação de " + movimentacaoEstoque.getTipoMovimentacaoEstoque() + " cadastrada com sucesso!");
                    }

                    // ==========================================
                    // BLOCO DE TRANSFERÊNCIA
                    // ==========================================
                    else if (movimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.TRANSFERENCIA) {
                        if (movimentacaoEstoque.getQtdeMovimentacaoEstoque() > itemEstoque.getQtdeItemEstoque()) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantidade insuficiente no estoque central para realizar a transferência!");
                        }
                        if (movimentacaoEstoque.getAcampamento() != null && movimentacaoEstoque.getAcampamentoDestino() != null) {
                            movimentoEstoqueService.gravarMovimentoEstoque(movimentacaoEstoque);
                            return ResponseEntity.status(HttpStatus.OK).body("Movimentação de TRANSFERÊNCIA registrada com sucesso!");
                        }
                        else {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Acampamento de Origem e Destino são obrigatórios!");
                        }
                    }
                    else {
                        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Tipo de movimento não encontrado!");
                    }
                }
                else{
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A quantidade da entrada deve ser maior que zero!");
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Item em estoque não cadastrado!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dados insuficientes para cadastro!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao gravar a Movimentação de Estoque!");
        }
    }

    @PutMapping(value = "/alterarMovimentoEstoque/{id}")
    public ResponseEntity<Object> alterarMovimentoEstoque(@PathVariable Long id, @RequestBody MovimentacaoEstoque novaMovimentacaoEstoque) {
        try {
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
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao alterar a Movimentação de Estoque!");
        }
    }

    @DeleteMapping(value = "/deletar/{id}")
    public ResponseEntity<Object> deletarMovimentacaoEstoque(@PathVariable Long id){
        MovimentacaoEstoque movimentacaoEstoque = movimentoEstoqueService.getMovimentacaoEstoqueId(id);
        if(movimentacaoEstoque != null){
            ItemEstoque itemEstoque = itemEstoqueService.getItemEstoqueId(movimentacaoEstoque.getItemEstoque().getIdItemEstoque());
            if(itemEstoque != null){
                // ==========================================
                // BLOCO DE ENTRADA
                // ==========================================
                if(movimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.ENTRADA){
                    int qtde = movimentacaoEstoque.getQtdeMovimentacaoEstoque();
                    if(itemEstoque.getQtdeItemEstoque() - qtde < 0)
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não é possível deletar esta entrada, pois o saldo do estoque ficaria negativo!");
                    itemEstoque.setQtdeItemEstoque(itemEstoque.getQtdeItemEstoque() - qtde); // Retiro a quantidade que foi de entrada
                    itemEstoqueService.save(itemEstoque);
                    movimentoEstoqueService.deletarMovimentoEstoque(movimentacaoEstoque);
                }

                // ==========================================
                // BLOCO DE SAIDA OU PERDA
                // ==========================================
                else if(movimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.SAIDA || movimentacaoEstoque.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.PERDA_VALIDADE){
                    int qtde = movimentacaoEstoque.getQtdeMovimentacaoEstoque();
                    itemEstoque.setQtdeItemEstoque(itemEstoque.getQtdeItemEstoque() + qtde); // devolvo a quantidade que foi de saida ou perda
                    itemEstoqueService.save(itemEstoque);
                    movimentoEstoqueService.deletarMovimentoEstoque(movimentacaoEstoque);
                }

                // ==========================================
                // BLOCO DE TRANSFERÊNCIA
                // ==========================================
                else{ // aqui eu somente deleto mesmo, nada demais
                    movimentoEstoqueService.deletarMovimentoEstoque(movimentacaoEstoque);
                }
                return ResponseEntity.status(HttpStatus.OK).body("Movimentação de estoque: " + movimentacaoEstoque.getTipoMovimentacaoEstoque() + " deletada com sucesso!");
            }
            else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Não possui esse item no estoque!");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movimentação de estoque não encontrada!");
    }

    @GetMapping(value = "/exibirSaldo/{id}")
    public ResponseEntity<Object> exibirSaldoMovimentacao(@PathVariable Long id){
        MovimentacaoEstoque movReferencia = movimentoEstoqueService.getMovimentacaoEstoqueId(id);
        if(movReferencia != null){
            String acampamentoAlvo = movReferencia.getAcampamento().getNomeAcampamento();
            Long idItemAlvo = movReferencia.getItemEstoque().getIdItemEstoque();
            List<MovimentacaoEstoque> historicoCompleto = movimentoEstoqueService.getAllMovimentacoesEstoque();
            int saldo = 0;

            for (MovimentacaoEstoque mov : historicoCompleto) {
                if (mov.getItemEstoque().getIdItemEstoque().equals(idItemAlvo)) {
                    // ==========================================
                    // BLOCO DE ENTRADA
                    // ==========================================
                    if (mov.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.ENTRADA) {
                        if (mov.getAcampamento().getNomeAcampamento().equals(acampamentoAlvo)) {
                            saldo = saldo + mov.getQtdeMovimentacaoEstoque(); // Ganhou, então SOMA
                        }
                    }
                    // ==========================================
                    // BLOCO DE SAÍDA OU PERDA
                    // ==========================================
                    else if (mov.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.SAIDA || mov.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.PERDA_VALIDADE) {
                        if (mov.getAcampamento().getNomeAcampamento().equals(acampamentoAlvo)) {
                            saldo = saldo - mov.getQtdeMovimentacaoEstoque(); // Gastou, então SUBTRAI
                        }
                    }
                    // ==========================================
                    // BLOCO DE TRANSFERÊNCIA
                    // ==========================================
                    else if (mov.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.TRANSFERENCIA) {
                        // Se o acampamento doou para outro (Ele é a Origem)
                        if (mov.getAcampamento().getNomeAcampamento().equals(acampamentoAlvo)) {
                            saldo = saldo - mov.getQtdeMovimentacaoEstoque(); // Doou, então SUBTRAI
                        }
                        // Se o acampamento recebeu de outro (Ele é o Destino)
                        else if (mov.getAcampamentoDestino() != null && mov.getAcampamentoDestino().getNomeAcampamento().equals(acampamentoAlvo)) {
                            saldo = saldo + mov.getQtdeMovimentacaoEstoque(); // Recebeu, então SOMA
                        }
                    }
                }
            }
            return ResponseEntity.status(HttpStatus.OK).body("Saldo atual de " + movReferencia.getItemEstoque().getNomeItemEstoque() + " para o acampamento " + acampamentoAlvo + ": " + saldo);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movimentação de estoque não encontrada!");
    }
}

