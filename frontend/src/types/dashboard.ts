// Números do Dashboard do acampamento (GET /dashboard/{idAcampamento}), já calculados no backend
export interface Dashboard {
    campistasInscritos: number;
    campistasCapacidade: number | null; // null = sem formulário de campista
    campistasConfirmados: number;
    servosInscritos: number;
    servosCapacidade: number | null;
    servosConfirmados: number;

    servosAguardandoAprovacao: number;
    pagamentosPendentes: number;

    itensRetirados: number;
    doacoesRecebidas: number;
    itensDoados: number;

    valorPrevisto: number;
    recebidoMercadoPago: number;
    recebidoManual: number;
    doacoesDinheiro: number;  // doações do tipo DINHEIRO (R$)

    servosPorEquipe: { equipe: string; quantidade: number }[];
}
