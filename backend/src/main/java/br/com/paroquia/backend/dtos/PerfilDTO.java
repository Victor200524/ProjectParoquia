package br.com.paroquia.backend.dtos;

import java.time.LocalDate;

public record PerfilDTO(
        String nome,
        String email,
        String cpf,
        String contato,
        String endereco,
        LocalDate dataNascimento,
        String nivel,
        byte[] foto
) {
}
