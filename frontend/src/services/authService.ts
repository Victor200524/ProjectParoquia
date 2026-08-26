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

    // Usando a tipagem específica do login!
    const dados: LoginResponse = await response.json(); 
    
    localStorage.setItem('token', dados.token); 
    localStorage.setItem('idUsuario', dados.idUsuario.toString()); 
    localStorage.setItem('nomeUsuario', dados.nomeUsuario); 

    return dados;
}