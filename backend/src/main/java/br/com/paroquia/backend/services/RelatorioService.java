package br.com.paroquia.backend.services;

import br.com.paroquia.backend.dtos.PrestacaoContasDTO;
import br.com.paroquia.backend.entities.*;
import br.com.paroquia.backend.enums.InscricaoAcampamentoStatus;
import br.com.paroquia.backend.enums.TipoDoacao;
import br.com.paroquia.backend.enums.TipoFormulario;
import br.com.paroquia.backend.enums.TipoMovimentacaoEstoque;
import br.com.paroquia.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RelatorioService {
    @Autowired
    MovimentacaoEstoqueRepository movimentacaoRepository;
    @Autowired
    DoacaoRepository doacaoRepository;
    @Autowired
    PagamentoRepository pagamentoRepository;
    @Autowired
    InscricaoAcampamentoRepository inscricaoRepository;
    @Autowired
    FormularioRepository formularioRepository;

    public PrestacaoContasDTO montarPrestacaoContas(Long idAcampamento) {

        // ===================== Parte 1: estoque =====================
        // Regra (combinada com a coordenação), olhando do ponto de vista DESTE acampamento:
        //   ENTRADA com ele        -> entrada (o item entrou no estoque para ele)
        //   SAÍDA com ele          -> saída (consumo)
        //   PERDA_VALIDADE com ele -> saída (perda)
        //   TRANSFERÊNCIA saindo dele   -> saída;  TRANSFERÊNCIA chegando nele -> entrada
        List<PrestacaoContasDTO.MovimentoEstoque> movimentos = new ArrayList<>();

        for (MovimentacaoEstoque mov : movimentacaoRepository.findByAcampamentoIdAcampamento(idAcampamento)) {
            String sentido;
            String detalhe;
            switch (mov.getTipoMovimentacaoEstoque()) {
                case ENTRADA -> { sentido = "ENTRADA"; detalhe = "Entrada no estoque"; }
                case SAIDA -> { sentido = "SAIDA"; detalhe = "Consumo"; }
                case PERDA_VALIDADE -> { sentido = "SAIDA"; detalhe = "Perda por validade"; }
                default -> { // TRANSFERENCIA saindo deste acampamento
                    sentido = "SAIDA";
                    detalhe = "Transferido para " + nomeAcampamento(mov.getAcampamentoDestino());
                }
            }
            movimentos.add(paraMovimento(mov, sentido, detalhe));
        }
        for (MovimentacaoEstoque mov : movimentacaoRepository.findByAcampamentoDestinoIdAcampamento(idAcampamento)) {
            // só TRANSFERÊNCIA tem destino; se origem e destino forem o mesmo, já entrou acima como saída e aqui volta como entrada
            if (mov.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.TRANSFERENCIA)
                movimentos.add(paraMovimento(mov, "ENTRADA", "Recebido de " + nomeAcampamento(mov.getAcampamento())));
        }
        movimentos.sort(Comparator.comparing(PrestacaoContasDTO.MovimentoEstoque::data, Comparator.nullsLast(Comparator.naturalOrder())));

        // resumo por item (TreeMap = já em ordem alfabética): [entradas, saídas]
        Map<String, long[]> porItem = new TreeMap<>();
        for (PrestacaoContasDTO.MovimentoEstoque mov : movimentos) {
            long[] soma = porItem.computeIfAbsent(mov.item(), k -> new long[]{0, 0});
            if (mov.sentido().equals("ENTRADA"))
                soma[0] += mov.quantidade();
            else
                soma[1] += mov.quantidade();
        }
        List<PrestacaoContasDTO.ResumoItem> resumoItens = new ArrayList<>();
        for (Map.Entry<String, long[]> item : porItem.entrySet())
            resumoItens.add(new PrestacaoContasDTO.ResumoItem(item.getKey(), item.getValue()[0], item.getValue()[1]));

        // doações: produtos vão para a parte do estoque, dinheiro para a parte financeira
        List<PrestacaoContasDTO.DoacaoProduto> doacoesProdutos = new ArrayList<>();
        List<PrestacaoContasDTO.DoacaoDinheiro> doacoesDinheiro = new ArrayList<>();
        for (Doacao doacao : doacaoRepository.findByAcampamentoIdAcampamento(idAcampamento)) {
            if (doacao.getTipoDoacao() == TipoDoacao.DINHEIRO)
                doacoesDinheiro.add(new PrestacaoContasDTO.DoacaoDinheiro(doacao.getDataDoacao(), doacao.getNomeDoacao(),
                        doacao.getNomeDoador(), doacao.getValorDoacao() == null ? 0 : doacao.getValorDoacao()));
            else
                doacoesProdutos.add(new PrestacaoContasDTO.DoacaoProduto(doacao.getDataDoacao(), doacao.getNomeDoacao(),
                        String.valueOf(doacao.getTipoDoacao()), doacao.getQtdeDoacao(), doacao.getNomeDoador()));
        }

        // ===================== Parte 2: financeiro =====================
        // inscrições pagas, somadas por "função | forma": [quantidade, total]
        Map<String, double[]> somas = new TreeMap<>();
        for (Pagamento pagamento : pagamentoRepository.findByInscricaoAcampamento_Acampamento_IdAcampamento(idAcampamento)) {
            String chave = pagamento.getInscricaoAcampamento().getFuncaoAcampamento() + "|" + pagamento.getFormaPagamento();
            double[] soma = somas.computeIfAbsent(chave, k -> new double[]{0, 0});
            soma[0] += 1;
            soma[1] += pagamento.getValorPagamento();
        }
        List<PrestacaoContasDTO.InscricoesPorForma> inscricoes = new ArrayList<>();
        for (Map.Entry<String, double[]> item : somas.entrySet()) {
            String[] partes = item.getKey().split("\\|");
            inscricoes.add(new PrestacaoContasDTO.InscricoesPorForma(partes[0], partes[1], (long) item.getValue()[0], item.getValue()[1]));
        }

        // quem ainda deve: valor = preço do formulário daquela função
        List<PrestacaoContasDTO.Pendente> pendentes = new ArrayList<>();
        for (InscricaoAcampamento inscricao : inscricaoRepository.findByAcampamentoIdAcampamento(idAcampamento)) {
            if (inscricao.getStatusAprovacao() != InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE)
                continue;
            Formulario formulario = formularioRepository.findFirstByAcampamentoIdAcampamentoAndTipoFormulario(
                    idAcampamento, TipoFormulario.valueOf(inscricao.getFuncaoAcampamento()));
            double valor = (formulario == null || formulario.getPrecoFormulario() == null) ? 0 : formulario.getPrecoFormulario();
            pendentes.add(new PrestacaoContasDTO.Pendente(inscricao.getUsuario().getNomeUsuario(), inscricao.getFuncaoAcampamento(), valor));
        }

        return new PrestacaoContasDTO(movimentos, resumoItens, doacoesProdutos, inscricoes, doacoesDinheiro, pendentes);
    }

    private PrestacaoContasDTO.MovimentoEstoque paraMovimento(MovimentacaoEstoque mov, String sentido, String detalhe) {
        return new PrestacaoContasDTO.MovimentoEstoque(
                mov.getDataMovimentacaoEstoque(),
                mov.getTipoMovimentacaoEstoque().toString(),
                sentido,
                mov.getItemEstoque().getNomeItemEstoque(),
                mov.getQtdeMovimentacaoEstoque(),
                detalhe,
                mov.getObsMovimentacaoEstoque(),
                mov.getUsuario() != null ? mov.getUsuario().getNomeUsuario() : null
        );
    }

    private String nomeAcampamento(Acampamento acampamento) {
        return acampamento != null ? acampamento.getNomeAcampamento() : "-";
    }
}
