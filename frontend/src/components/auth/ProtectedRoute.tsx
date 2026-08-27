'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  niveisPermitidos: string[]; // Recebe um array com os níveis que podem acessar
}

export default function ProtectedRoute({ children, niveisPermitidos }: ProtectedRouteProps) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    // Busca o nível salvo no navegador
    const nivelSalvo = localStorage.getItem('nivelUsuario');
    
    // Se não estiver logado ou se o nível não estiver na lista de permitidos
    if (!nivelSalvo || !niveisPermitidos.includes(nivelSalvo)) {
      router.push('/acesso-negado');
    } 
    else {
      setAutorizado(true); // Libera o acesso
    }
  }, [niveisPermitidos, router]);

  // Enquanto verifica, não renderiza a tela (evita que a tela apareça por meio segundo e depois suma)
  if (!autorizado) 
    return null; 

  return <>
        {children}
    </>;
}