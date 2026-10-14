'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { verificarSessao } from '@/services/authService';

// Fica no layout do dashboard: a cada página aberta confere se o usuário continua logado.
// Se não estiver (nunca logou ou o servidor foi reiniciado), manda para a tela de login.
export default function VerificarSessao() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function conferir() {
      const logado = await verificarSessao();
      if (!logado)
        router.push('/login');
    }
    conferir();
  }, [pathname, router]);

  return null; // não desenha nada na tela, só faz a verificação
}
