export async function login(dadosLogin: { cpf: string, senha: string }) {
    const response = await fetch("http://localhost:8080/usuario/loginUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosLogin)
    });
    if (!response.ok) {
        throw new Error("CPF ou senha incorretos");
    }
    const mensagem = await response.text(); 
    localStorage.setItem('token', 'logado-sucesso'); 
    
    return mensagem;
}