package br.com.paroquia.backend.dtos;

import java.util.List;

public record DashboardDTO(
        // Inscrições reprovados não contam
        long campistasInscritos,
        Integer campistasCapacidade,   // capacidade do formulário de campistas (null = sem formulário/limite)
        long campistasConfirmados,     // pagos ou gratuitos
        long servosInscritos,
        Integer servosCapacidade,
        long servosConfirmados,

        // Pendências
        long servosAguardandoAprovacao,
        long pagamentosPendentes,

        // Estoque e doações
        long itensRetirados,           // soma das quantidades de SAÍDA e TRANSFERÊNCIA para o acampamento
        long doacoesRecebidas,         // quantas doações foram registradas
        long itensDoados,              // soma das quantidades doadas

        // Dinheiro
        double valorPrevisto,          // inscritos x preço do formulário
        double recebidoMercadoPago,
        double recebidoManual,         // dinheiro + PIX registrados pela coordenação
        double doacoesDinheiro,        // doações do tipo DINHEIRO (R$)

        // Servos por equipe
        List<EquipeQuantidade> servosPorEquipe
) {
    public record EquipeQuantidade(String equipe, long quantidade) {
    }
}
