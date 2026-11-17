package br.com.paroquia.backend.dtos;

import java.time.LocalDate;

// O que o usuário pode mudar no próprio perfil (PUT /usuario/meuPerfil).
// CPF, nível e status ficam de fora de propósito: só o admin muda isso.
public record AlterarPerfilDTO(
        String nome,
        String email,
        String contato,
        String endereco,
        LocalDate dataNascimento,
        byte[] foto,          // foto nova (base64 no JSON); null = mantém a atual
        Boolean removerFoto,  // true = apaga a foto
        String senhaAtual,    // obrigatória só quando for trocar a senha
        String novaSenha      // vazia = mantém a senha
) {
}
