// Uma inscrição com pagamento pendente (linha da tabela)
export interface PendentePagamento {
    idInscricao: number;
    nomeUsuario: string;
    emailUsuario: string | null;
    contatoUsuario: string | null;
    funcao: string;                 // CAMPISTA ou SERVO
    valor: number | null;           // null = formulário sem preço informado
    dataInscricao: string;
    diasDesdeInscricao: number;
}

// O que o backend devolve em GET /alertaPagamento/{idAcampamento}
export interface AlertasPagamento {
    idAcampamento: number;
    nomeAcampamento: string;
    dataInicioAcampamento: string;
    diasParaAcampamento: number;    // negativo = já começou
    emailConfigurado: boolean;
    aceitaPagamentoOnline: boolean; // true = acampamento tem Mercado Pago
    totalPendente: number;
    pendentes: PendentePagamento[];

    // programação do envio automático
    lembreteAtivo: boolean;
    lembreteIntervaloDias: number | null;
    lembreteUltimoEnvio: string | null;
    proximoEnvio: string | null;    // null = não vai ter próximo envio
}

// Resposta do "Enviar e-mail para todos"
export interface ResultadoEnvio {
    enviados: number;
    falhas: string[];
}
