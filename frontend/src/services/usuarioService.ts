import { Usuario } from "../types/usuario";
const BASE_URL = "http://localhost:8080/usuario";

export const usuarioService = {
    async listarUsuarios(): Promise<Usuario[]> {
        try {
            const response = await fetch(`${BASE_URL}/getAllUsers`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}` 
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao listar os usuários!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async buscarUsuarioPorEmail(emailUsuario: string): Promise<Usuario> {
        try {
            const response = await fetch(`${BASE_URL}/buscarUsuario/${emailUsuario}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao buscar usuário por e-mail!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async cadastrarUsuario(usuario: Usuario): Promise<string> {
        try {
            // Rota pública (cadastro de quem ainda não tem conta), por isso não manda o token
            const response = await fetch(`${BASE_URL}/cadastrarUsuario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });
            
            // O Java retorna uma String de sucesso ou erro (ex: "E-mail já cadastrado!")
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao criar usuário");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async cadastrarUsuarioAdmin(usuario: Usuario): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/cadastrarUsuarioAdmin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(usuario)
            });
            
            // O Java retorna uma String de sucesso ou erro (ex: "E-mail já cadastrado!")
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao criar usuário");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async alterarUsuario(idUsuario: number, usuarioAtualizado: Usuario): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/alterarUsuario/${idUsuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(usuarioAtualizado)
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao alterar usuário!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async deletarUsuario(idUsuario: number): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/deletarUsuario/${idUsuario}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao deletar usuário!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};