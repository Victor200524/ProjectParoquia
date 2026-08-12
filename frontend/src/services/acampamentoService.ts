import {Acampamento} from "../models/acampamento";

const BASE_URL = "http://localhost:8080/acampamento";



export const acampamentoService = {
    // Async devido a operações de rede que podem levar algum tempo para serem concluídas
    async criarAcampamento(acampamento: Acampamento): Promise<Acampamento> {
        try{
            const response = await fetch(`${BASE_URL}/gravarAcampamento`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // avisa que o corpo da mensagem é um JSON
                    // Token de segurança vai ser adicionado aqui no futuro
                },
                body: JSON.stringify(acampamento) //Objeto em TS é transformado em JSON para envio
            });

            if(!response.ok){
                // Faz a leitura da mensagem de erro que é retornada pelo backend
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Erro ao criar acampamento");
            }
            return await response.json(); // Converte a resposta do backend de JSON para objeto JS/TS

        }catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error; // Propaga o erro para que a camada de apresentação possa lidar com ele
        }
    },

    async alterarAcampamento(idAcampamento: number, acampamento: Acampamento): Promise<Acampamento> {
        try{
            const response = await fetch(`${BASE_URL}/alterarAcampamento/${idAcampamento}`, {
                method: "PUT",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(acampamento)
            })
            if(!response.ok){
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Erro ao alterar acampamento!");
            }
            return await response.json();
        }catch(error){
            console.error("Erro na camade de serviço: ", error);
            throw error;
        }
    },

    async listarAcampamentos(): Promise<Acampamento[]> {
        try{
            const response = await fetch(`${BASE_URL}/todosAcampamentos`, {
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                },
            })
            if(!response.ok){
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Erro ao listar os acampamentos!");
            }
            return await response.json();
        } catch(error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async buscarAcampamentoPorNome(nomeAcampamento: string): Promise<Acampamento[]> {
        try{
            const response = await fetch( `${BASE_URL}/buscarAcampamento/${nomeAcampamento}`,{
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                },
            })
            if(!response.ok){
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Erro ao buscar acampamento por nome!");
            }
            return await response.json();
        }catch(error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async deletarAcampamento(idAcampamento: number): Promise<void> {
        try{
            const response = await fetch(`${BASE_URL}/deletarAcampamento/${idAcampamento}`, {
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json"
                },
            })
            if(!response.ok){
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Erro ao deletar acampamento!");
            }
        }catch(error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
}