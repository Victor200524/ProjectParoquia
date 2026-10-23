package br.com.paroquia.backend.dtos;

import br.com.paroquia.backend.entities.Comunidade;

import java.util.Date;

public record AcampamentoPublicoDTO(
        Long idAcampamento,
        String nomeAcampamento,
        String localAcampamento,
        Integer idadeMinAcampamento,
        Integer idadeMaxAcampamento,
        Double taxaInscricaoAcampamento,
        Integer vagasAcampamento,
        Date dataInicioAcampamento,
        Date dataFimAcampamento,
        String informacoesAcampamento,
        byte[] fotoAcampamento,
        Comunidade comunidade
) {
}
