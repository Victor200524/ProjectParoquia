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
