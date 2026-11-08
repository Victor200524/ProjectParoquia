package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findByInscricaoAcampamento_IdInscricao(Long inscricaoAcampamentoIdInscricao);
    boolean existsByIdMercadoPagoPagamento(String idMercadoPagoPagamento);
    List<Pagamento> findByInscricaoAcampamento_Acampamento_IdAcampamento(Long idAcampamento);
}
