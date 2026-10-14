import { LoginResponse } from '@/types/usuario';

export async function login(dadosLogin: { cpf: string, senha: string }) {
    const response = await fetch("http://localhost:8080/usuario/loginUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosLogin)
    });

    if (!response.ok) {
        const erroMsg = await response.text(); 
        throw new Error(erroMsg || "Erro ao fazer login");
    }

    const dados: LoginResponse = await response.json(); 
    
    localStorage.setItem('token', dados.token); 
    localStorage.setItem('idUsuario', dados.idUsuario.toString()); 
    localStorage.setItem('nomeUsuario', dados.nomeUsuario); 
    localStorage.setItem('nivelUsuario', dados.nivelUsuario);
    return dados;
}

// Apaga os dados do usuário guardados no navegador
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('nivelUsuario');
}

// Confere se o usuário continua logado.
// O token guardado no login é o código que o servidor gerou quando ligou; se o servidor reiniciou,
// o código mudou, o token antigo não bate mais e o usuário é deslogado.
export async function verificarSessao(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token)
        return false;

    try {
        const response = await fetch("http://localhost:8080/usuario/sessaoServidor");
        const sessaoServidor = await response.text();

        if (response.ok && sessaoServidor !== token) {
            logout();
            return false;
        }
        return true;
    } catch (error) {
        // servidor fora do ar: não dá para conferir, então mantém como está
        console.error('Não foi possível verificar a sessão:', error);
        return true;
    }
}
