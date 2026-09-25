import { UsuarioTipoNivel } from "@/types/usuario";

export type WidgetPainel = 'atalhosRapidos' | 'estatisticasCards' | 'ultimasMovimentacoes';

export const painelWidgetsPorNivel: Record<UsuarioTipoNivel, WidgetPainel[]> = {
    COORDENADOR_GERAL: ['atalhosRapidos', 'estatisticasCards', 'ultimasMovimentacoes'],
    PADRE: ['atalhosRapidos', 'estatisticasCards', 'ultimasMovimentacoes'],
    SECRETARIA: ['atalhosRapidos', 'estatisticasCards', 'ultimasMovimentacoes'],
    COORDENADOR_ACAMPAMENTO: ['atalhosRapidos', 'estatisticasCards', 'ultimasMovimentacoes'],
    SERVO: ['atalhosRapidos'],
    CAMPISTA: ['atalhosRapidos']
}