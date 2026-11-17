package br.com.paroquia.backend.services;

import br.com.paroquia.backend.dtos.DashboardDTO;
import br.com.paroquia.backend.entities.*;
import br.com.paroquia.backend.enums.FormaPagamento;
import br.com.paroquia.backend.enums.InscricaoAcampamentoStatus;
import br.com.paroquia.backend.enums.TipoDoacao;
import br.com.paroquia.backend.enums.TipoFormulario;
import br.com.paroquia.backend.enums.TipoMovimentacaoEstoque;
import br.com.paroquia.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class DashboardService {
    @Autowired
    InscricaoAcampamentoRepository inscricaoRepository;
    @Autowired
    FormularioRepository formularioRepository;
    @Autowired
    PagamentoRepository pagamentoRepository;
    @Autowired
    MovimentacaoEstoqueRepository movimentacaoRepository;
    @Autowired
    DoacaoRepository doacaoRepository;

    public DashboardDTO montarDashboard(Long idAcampamento) {
        Formulario formCampista = formularioRepository.findFirstByAcampamentoIdAcampamentoAndTipoFormulario(idAcampamento, TipoFormulario.CAMPISTA);
        Formulario formServo = formularioRepository.findFirstByAcampamentoIdAcampamentoAndTipoFormulario(idAcampamento, TipoFormulario.SERVO);
        double precoCampista = preco(formCampista);
        double precoServo = preco(formServo);

        // ===== Inscrições: um passeio só pela lista, contando cada coisa =====
        long campistasInscritos = 0, campistasConfirmados = 0;
        long servosInscritos = 0, servosConfirmados = 0;
        long servosAguardando = 0, pagamentosPendentes = 0;
        double valorPrevisto = 0;
        Map<String, Long> equipes = new TreeMap<>(); // TreeMap = já fica em ordem alfabética

        for (InscricaoAcampamento inscricao : inscricaoRepository.findByAcampamentoIdAcampamento(idAcampamento)) {
            InscricaoAcampamentoStatus status = inscricao.getStatusAprovacao();
            if (status == InscricaoAcampamentoStatus.REPROVADO)
                continue; // reprovado não conta em nada

            boolean campista = "CAMPISTA".equals(inscricao.getFuncaoAcampamento());
            boolean confirmado = status == InscricaoAcampamentoStatus.CONFIRMADO;

            if (status == InscricaoAcampamentoStatus.AGUARDANDO_APROVACAO)
                servosAguardando++;
            if (status == InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE)
                pagamentosPendentes++;

            if (campista) {
                campistasInscritos++;
                if (confirmado) campistasConfirmados++;
                valorPrevisto += precoCampista;
            } else {
                servosInscritos++;
                if (confirmado) servosConfirmados++;
                // servo aguardando aprovação ainda não deve nada
                if (status != InscricaoAcampamentoStatus.AGUARDANDO_APROVACAO)
                    valorPrevisto += precoServo;

                String equipe = inscricao.getEquipeAcampamento();
                equipe = (equipe == null || equipe.isBlank()) ? "SEM EQUIPE" : equipe.trim().toUpperCase();
                equipes.put(equipe, equipes.getOrDefault(equipe, 0L) + 1);
            }
        }

        List<DashboardDTO.EquipeQuantidade> servosPorEquipe = new ArrayList<>();
        for (Map.Entry<String, Long> item : equipes.entrySet())
            servosPorEquipe.add(new DashboardDTO.EquipeQuantidade(item.getKey(), item.getValue()));

        // ===== Itens retirados do estoque da paróquia para este acampamento =====
        long itensRetirados = 0;
        for (MovimentacaoEstoque mov : movimentacaoRepository.findByAcampamentoIdAcampamento(idAcampamento)) {
            if (mov.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.SAIDA)
                itensRetirados += mov.getQtdeMovimentacaoEstoque();
        }
        for (MovimentacaoEstoque mov : movimentacaoRepository.findByAcampamentoDestinoIdAcampamento(idAcampamento)) {
            if (mov.getTipoMovimentacaoEstoque() == TipoMovimentacaoEstoque.TRANSFERENCIA)
                itensRetirados += mov.getQtdeMovimentacaoEstoque();
        }

        // ===== Doações =====
        List<Doacao> doacoes = doacaoRepository.findByAcampamentoIdAcampamento(idAcampamento);
        long itensDoados = 0;
        double doacoesDinheiro = 0;
        for (Doacao doacao : doacoes) {
            if (doacao.getTipoDoacao() == TipoDoacao.DINHEIRO)
                doacoesDinheiro += doacao.getValorDoacao() == null ? 0 : doacao.getValorDoacao();
            else
                itensDoados += doacao.getQtdeDoacao();
        }

        // ===== Pagamentos recebidos =====
        double recebidoMercadoPago = 0, recebidoManual = 0;
        for (Pagamento pagamento : pagamentoRepository.findByInscricaoAcampamento_Acampamento_IdAcampamento(idAcampamento)) {
            if (pagamento.getFormaPagamento() == FormaPagamento.MERCADO_PAGO)
                recebidoMercadoPago += pagamento.getValorPagamento();
            else
                recebidoManual += pagamento.getValorPagamento();
        }

        return new DashboardDTO(
                campistasInscritos, capacidade(formCampista), campistasConfirmados,
                servosInscritos, capacidade(formServo), servosConfirmados,
                servosAguardando, pagamentosPendentes,
                itensRetirados, doacoes.size(), itensDoados,
                valorPrevisto, recebidoMercadoPago, recebidoManual, doacoesDinheiro,
                servosPorEquipe
        );
    }

    private double preco(Formulario formulario) {
        return (formulario == null || formulario.getPrecoFormulario() == null) ? 0 : formulario.getPrecoFormulario();
    }

    private Integer capacidade(Formulario formulario) {
        return formulario == null ? null : formulario.getCapacidadeFormulario();
    }
}
