package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.enums.InscricaoAcampamentoStatus;
import br.com.paroquia.backend.repositories.InscricaoAcampamentoRepository;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class InscricaoAcampamentoService {
    @Autowired
    InscricaoAcampamentoRepository inscricaoRepository;

    public InscricaoAcampamento buscarInscricao(Long idInscricao) {
        return inscricaoRepository.findById(idInscricao).orElse(null);
    }

    public List<InscricaoAcampamento> buscarInscricaoNome(String nome){
        return inscricaoRepository.findByUsuarioNomeUsuarioContainingIgnoreCase(nome);
    }

    public InscricaoAcampamento buscarInscricaoUsuarioAcampamento(Long idUsuario, Long idAcampamento){
        return inscricaoRepository.findByUsuarioIdUsuarioAndAcampamentoIdAcampamento(idUsuario, idAcampamento);
    }

    public List<InscricaoAcampamento> buscarInscricaoUsuario(Long idUsuario){
        return inscricaoRepository.findByUsuarioIdUsuario(idUsuario);
    }

    // Conta quantos já ocupam vaga naquele acampamento e função; reprovado não conta, pois libera a vaga
    public long contarInscritos(Long idAcampamento, String funcaoAcampamento){
        return inscricaoRepository.countByAcampamentoIdAcampamentoAndFuncaoAcampamentoAndStatusAprovacaoNot(
                idAcampamento, funcaoAcampamento, InscricaoAcampamentoStatus.REPROVADO);
    }

    public List<InscricaoAcampamento> getAllInscricao(){
        return inscricaoRepository.findAll();
    }

    public void save(InscricaoAcampamento inscricao) {
        inscricaoRepository.save(inscricao);
    }

    // Quando o nível do usuário muda para CAMPISTA ou SERVO, as inscrições dele acompanham a nova função
    // Só mexe em acampamentos que ainda não acabaram: os que já aconteceram ficam como histórico
    public void acompanharNivelUsuario(Usuario usuario){
        String funcao = usuario.getNivelUsuario().name();
        if(funcao.equals("CAMPISTA") || funcao.equals("SERVO")){ // outros níveis (PADRE, SECRETARIA...) não mexem nas inscrições
            Date inicioDeHoje = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());

            for(InscricaoAcampamento inscricao : inscricaoRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())){
                Date dataFim = inscricao.getAcampamento().getDataFimAcampamento();
                boolean acampamentoAcabou = dataFim != null && dataFim.before(inicioDeHoje);

                if(!acampamentoAcabou && !funcao.equals(inscricao.getFuncaoAcampamento())){
                    inscricao.setFuncaoAcampamento(funcao);
                    // volta para o status inicial da nova função, igual ao gravarInscricao
                    if(funcao.equals("SERVO"))
                        inscricao.setStatusAprovacao(InscricaoAcampamentoStatus.AGUARDANDO_APROVACAO);
                    else{
                        inscricao.setStatusAprovacao(InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE);
                        inscricao.setEquipeAcampamento(null); // campista não tem equipe
                    }
                    inscricaoRepository.save(inscricao);
                }
            }
        }
    }

    public void deletarInscricao(InscricaoAcampamento inscricaoAcampamento) {
        inscricaoRepository.delete(inscricaoAcampamento);
    }
}
