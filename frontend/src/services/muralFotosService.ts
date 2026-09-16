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
    async alterarMuralFotos(idMuralFotos: number, muralFotos: MuralFotos): Promise<MuralFotos> {
        try{
            const response = await fetch(`${BASE_URL}/alterarMuralFotos/${idMuralFotos}`, {
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
            return await response.json();
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async listarMuralFotos() {
        try{
            const response = await fetch(`${BASE_URL}/todasMuralFotos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao listar mural de fotos");
            }
            return await response.json();
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async deletarMuralFotos(idMuralFotos: number): Promise<string> {
        try{
            const response = await fetch(`${BASE_URL}/deletarMuralFotos/${idMuralFotos}`, {
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