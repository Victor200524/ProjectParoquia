import {MuralFotos} from '@/types/muralFotos';
const BASE_URL = "http://localhost:8080/muralFotos";

export const MuralFotosService = {
    async criarMuralFotos(muralFotos: MuralFotos): Promise<string> {
        try{
            const response = await fetch(`${BASE_URL}/gravarMural`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(muralFotos)
            });
            
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao criar mural de fotos");
            }
            return responseText;
            
        }catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async alterarMuralFotos(idMuralFotos: number, muralFotos: MuralFotos): Promise<string> {
        try{
            const response = await fetch(`${BASE_URL}/alterarMural/${idMuralFotos}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(muralFotos)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao alterar mural de fotos!");
            }
            return responseText;
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async listarMuralFotos(): Promise<MuralFotos[]> {
        try{
            const response = await fetch(`${BASE_URL}/getAllMurais`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(responseText || "Erro ao listar mural de fotos");
            }
            return await response.json();
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    // Versão pública da listagem, usada na página inicial (visitante sem login).
    // Não manda o header Authorization: o GET de /muralFotos é liberado no backend,
    // e um token vencido guardado no navegador poderia atrapalhar a busca.
    async listarMuralFotosPublico(): Promise<MuralFotos[]> {
        const response = await fetch(`${BASE_URL}/getAllMurais`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
            const responseText = await response.text();
            throw new Error(responseText || "Erro ao listar mural de fotos");
        }
        return await response.json();
    },
    async deletarMuralFotos(idMuralFotos: number): Promise<string> {
        try{
            const response = await fetch(`${BASE_URL}/deletarMural/${idMuralFotos}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao deletar mural de fotos");
            }
            return responseText;
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};