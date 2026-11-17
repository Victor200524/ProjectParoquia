package br.com.paroquia.backend.dtos;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

// Tudo o que o relatório de prestação de contas de um acampamento precisa
// Monta só com o que já existe: movimentação de estoque, doações e pagamentos das inscrições.
// Os totais a tela soma a partir destas listas.
public record PrestacaoContasDTO(
        // ===== Parte 1: estoque =====
        List<MovimentoEstoque> movimentos,       // cada movimentação que mexeu com este acampamento, já como entrada ou saída
        List<ResumoItem> resumoItens,            // por item: quanto entrou, quanto saiu e o saldo
        List<DoacaoProduto> doacoesProdutos,     // doações em produtos (seção separada)

        // ===== Parte 2: financeiro =====
        List<InscricoesPorForma> inscricoes,     // inscrições pagas, somadas por função e forma de pagamento
        List<DoacaoDinheiro> doacoesDinheiro,    // doações em dinheiro
        List<Pendente> pendentes                 // inscrições que ainda não pagaram
) {
    // sentido: "ENTRADA" ou "SAIDA" do ponto de vista deste acampamento; detalhe: ex. "Transferido para Acampamento Y"
    public record MovimentoEstoque(LocalDateTime data, String tipo, String sentido, String item, int quantidade,
                                   String detalhe, String observacao, String responsavel) { }

    public record ResumoItem(String item, long entradas, long saidas) { }

    public record DoacaoProduto(Date data, String nome, String tipo, Integer quantidade, String doador) { }

    public record InscricoesPorForma(String funcao, String forma, long quantidade, double total) { }

    public record DoacaoDinheiro(Date data, String nome, String doador, double valor) { }

    public record Pendente(String nome, String funcao, double valor) { }
}
