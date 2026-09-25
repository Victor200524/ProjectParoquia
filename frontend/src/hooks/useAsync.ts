import { useEffect, useState } from 'react';

export function useAsync<T>(funcaoBusca: () => Promise<T>) {
    const [dados, setDados] = useState<T | undefined>(undefined);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);
    
    useEffect(() => {
        async function busca() {
            try{
                setCarregando(true);
                const resultado = await funcaoBusca();
                setDados(resultado);
            }catch (erroCapturado){
                setErro((erroCapturado as Error).message);
            }finally{
                setCarregando(false);
            }
        }
        busca();
    }, [])
    return { dados, carregando, erro }; // retorna os dados, o estado de carregamento e o erro (se houver)
}