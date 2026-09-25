import { useEffect, useState } from 'react';
import { UsuarioTipoNivel } from '@/types/usuario';

interface UsuarioLogado{
    idUsuario?: number;
    nomeUsuario?: string;
    nivelUsuario?: UsuarioTipoNivel;
}

export const useUsuarioLogado = () => { // função corpo do hook
    const [usuario, setUsuario] = useState<UsuarioLogado>({ // Deixei eles com oundefined pois são dados que podem ou nao estar presentes dentro do localStorage
        idUsuario: undefined,
        nomeUsuario: undefined,
        nivelUsuario: undefined
    })

    useEffect(() => {
        const idSalvo = localStorage.getItem('idUsuario')
        const nomeSalvo = localStorage.getItem('nomeUsuario')
        const nivelSalvo = localStorage.getItem('nivelUsuario') 
        setUsuario({
            idUsuario: idSalvo ? Number(idSalvo) : undefined,
            nomeUsuario: nomeSalvo ? nomeSalvo : undefined,
            nivelUsuario: nivelSalvo ? nivelSalvo as UsuarioTipoNivel : undefined
        })
    },[]);
    return usuario;
}