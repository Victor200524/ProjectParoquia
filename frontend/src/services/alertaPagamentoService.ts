import { AlertasPagamento, ResultadoEnvio } from "../types/alertaPagamento";

const BASE_URL = "http://localhost:8080/alertaPagamento";

function cabecalhos(){
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
    };
}

// Se o backend respondeu com erro, lança o texto que ele mandou (ex.: "Informe de quantos em quantos dias...")
async function verificarResposta(response: Response, mensagemPadrao: string){
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || mensagemPadrao);
    }
}

export const alertaPagamentoService = {
    async listarPendentes(idAcampamento: number): Promise<AlertasPagamento> {
        const response = await fetch(`${BASE_URL}/${idAcampamento}`, { method: "GET", headers: cabecalhos() });
        await verificarResposta(response, "Erro ao buscar os pagamentos pendentes!");
        return await response.json();
    },

    // Envia o e-mail de cobrança para uma inscrição; devolve a mensagem do backend
    async enviarParaUm(idInscricao: number): Promise<string> {
        const response = await fetch(`${BASE_URL}/enviar/${idInscricao}`, { method: "POST", headers: cabecalhos() });
        await verificarResposta(response, "Erro ao enviar o e-mail!");
        return await response.text();
    },

    async enviarParaTodos(idAcampamento: number): Promise<ResultadoEnvio> {
        const response = await fetch(`${BASE_URL}/enviarTodos/${idAcampamento}`, { method: "POST", headers: cabecalhos() });
        await verificarResposta(response, "Erro ao enviar os e-mails!");
        return await response.json();
    },

    async salvarProgramacao(idAcampamento: number, ativo: boolean, intervaloDias: number | null): Promise<string> {
        const response = await fetch(`${BASE_URL}/programacao/${idAcampamento}`, {
            method: "PUT",
            headers: cabecalhos(),
            body: JSON.stringify({ ativo, intervaloDias })
        });
        await verificarResposta(response, "Erro ao salvar a programação!");
        return await response.text();
    }
};
