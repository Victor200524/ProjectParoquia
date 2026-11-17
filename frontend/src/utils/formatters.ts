// Funções que formatam o texto enquanto a pessoa digita.
// O backend compara o CPF exatamente como foi gravado, então ele precisa ir sempre no mesmo formato.

// Deixa o CPF no formato 000.000.000-00
export function formatarCPF(valor: string){
    return valor
        .replace(/\D/g, '') // remove tudo que não é número
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substring(0, 14);
}

// Deixa o telefone no formato (00) 00000-0000 (celular) ou (00) 0000-0000 (fixo)
export function formatarTelefone(valor: string){
    const numeros = valor.replace(/\D/g, '').substring(0, 11); // só os números, no máximo 11

    if(numeros.length <= 10)
        return numeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');

    return numeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

// O backend pode mandar a data como "2026-11-08", "2026-11-08T03:00:00.000+00:00" ou como número.
// Esta função devolve sempre "2026-11-08", que é o formato que o <input type="date"> entende.
export function dataParaInput(valor: string | number | undefined | null){
    if(valor === undefined || valor === null || valor === '')
        return '';
    if(typeof valor === 'number')
        return new Date(valor).toISOString().substring(0, 10);
    return valor.substring(0, 10);
}

// Mostra a data no formato brasileiro: 08/11/2026
export function formatarData(valor: string | number | undefined | null){
    const data = dataParaInput(valor);
    if(data === '')
        return '-';
    const [ano, mes, dia] = data.split('-');
    return dia + '/' + mes + '/' + ano;
}

// Troca o texto do banco (NAO_PERECIVEL) por um texto mais amigável (Nao perecivel)
export function formatarTexto(texto: string | undefined | null){
    if(!texto)
        return '';
    const minusculo = texto.replaceAll('_', ' ').toLowerCase();
    return minusculo.charAt(0).toUpperCase() + minusculo.slice(1);
}

// Mostra um valor em reais: R$ 150,00
export function formatarDinheiro(valor: number | undefined | null){
    return (valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
