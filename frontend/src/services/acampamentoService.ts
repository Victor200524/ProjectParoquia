import {Acampamento} from "../types/acampamento";
const BASE_URL = "http://localhost:8080/acampamento";

export const acampamentoService = {
    // Async devido a operações de rede que podem levar algum tempo para serem concluídas
    async criarAcampamento(acampamento: Acampamento, arquivoFoto: File | null): Promise<string> {
        try {
            const formData = new FormData();
            // Transformamos o objeto em JSON e adicionamos como um Blob
            const jsonBlob = new Blob([JSON.stringify(acampamento)], { type: 'application/json' });
            formData.append('acampamento', jsonBlob);
            if (arquivoFoto) {
                formData.append('foto', arquivoFoto);
            }
            const response = await fetch(`${BASE_URL}/gravarAcampamento`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },

                body: formData

            });
            // Lemos a resposta como texto, não como JSON
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao criar acampamento");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async alterarAcampamento(idAcampamento: number, acampamento: Acampamento): Promise<Acampamento> {
        try {
            const response = await fetch(`${BASE_URL}/alterarAcampamento/${idAcampamento}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(acampamento)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Erro ao alterar acampamento!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camade de serviço: ", error);
            throw error;
        }
    },

    async listarAcampamentos() {
        try {
            const response = await fetch(`${BASE_URL}/todosAcampamentos`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}` 
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Erro ao listar os acampamentos!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async buscarAcampamentoPorNome(nomeAcampamento: string): Promise<Acampamento[]> {
        try {
            const response = await fetch(`${BASE_URL}/buscarAcampamento/${nomeAcampamento}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Erro ao buscar acampamento por nome!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async deletarAcampamento(idAcampamento: number): Promise<void> {
        try {
            const response = await fetch(`${BASE_URL}/deletarAcampamento/${idAcampamento}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Erro ao deletar acampamento!");
            }

        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }

};

