package br.com.paroquia.backend.dtos;

import java.time.LocalDate;

// Uma pessoa no quadrante do acampamento: só os dados que vão impressos (sem CPF, e-mail, senha...)
// A foto (byte[]) vai no JSON como texto base64, pronta para usar no <img> do front.
public record QuadrantePessoaDTO(
        String nome,
        String telefone,
        String endereco,
        LocalDate dataNascimento,
        String funcao,
        String equipe,
        byte[] foto
) {
}
