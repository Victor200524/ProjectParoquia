package br.com.paroquia.backend.services;

import br.com.paroquia.backend.dtos.AlertasPagamentoDTO;
import br.com.paroquia.backend.entities.Acampamento;
import br.com.paroquia.backend.entities.Formulario;
import br.com.paroquia.backend.entities.InscricaoAcampamento;
import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.enums.InscricaoAcampamentoStatus;
import br.com.paroquia.backend.enums.TipoFormulario;
import br.com.paroquia.backend.repositories.AcampamentoRepository;
import br.com.paroquia.backend.repositories.FormularioRepository;
import br.com.paroquia.backend.repositories.InscricaoAcampamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
public class AlertaPagamentoService {
    @Autowired
    InscricaoAcampamentoRepository inscricaoRepository;
    @Autowired
    FormularioRepository formularioRepository;
    @Autowired
    AcampamentoRepository acampamentoRepository;

    // Quem envia o e-mail. O Spring só cria esse objeto se o spring.mail.host estiver no application.properties;
    // required = false deixa o backend subir mesmo sem a configuração (aí fica null e a tela avisa)
    @Autowired(required = false)
    JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    String remetente;

    // Endereço do site, usado no link do e-mail
    @Value("${app.url-frontend:http://localhost:3000}")
    String urlFrontend;

    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // Horário em que o agendador (LembretePagamentoAgendador) roda todo dia
    public static final int HORA_ENVIO_AUTOMATICO = 9;

    // ===================== Listagem =====================

    public AlertasPagamentoDTO listarPendentes(Long idAcampamento) {
        Acampamento acampamento = acampamentoRepository.findById(idAcampamento).orElse(null);
        if (acampamento == null)
            return null;

        LocalDate hoje = LocalDate.now();
        LocalDate inicio = paraLocalDate(acampamento.getDataInicioAcampamento());

        List<AlertasPagamentoDTO.Pendente> pendentes = new ArrayList<>();
        double totalPendente = 0;
        for (InscricaoAcampamento inscricao : buscarPendentes(idAcampamento)) {
            Usuario usuario = inscricao.getUsuario();
            Double valor = valorDaInscricao(inscricao);
            if (valor != null)
                totalPendente += valor;

            long diasDesdeInscricao = ChronoUnit.DAYS.between(inscricao.getDataRegistro().toLocalDate(), hoje);
            pendentes.add(new AlertasPagamentoDTO.Pendente(
                    inscricao.getIdInscricao(), usuario.getNomeUsuario(), usuario.getEmailUsuario(),
                    usuario.getContatoUsuario(), inscricao.getFuncaoAcampamento(), valor,
                    inscricao.getDataRegistro(), diasDesdeInscricao));
        }

        return new AlertasPagamentoDTO(
                acampamento.getIdAcampamento(), acampamento.getNomeAcampamento(), inicio,
                ChronoUnit.DAYS.between(hoje, inicio), isEmailConfigurado(), acampamento.isAceitaPagamentoOnline(),
                totalPendente, pendentes,
                isLembreteAtivo(acampamento), acampamento.getLembreteIntervaloDiasAcampamento(),
                acampamento.getLembreteUltimoEnvioAcampamento(), calcularProximoEnvio(acampamento));
    }

    // ===================== Programação do envio automático =====================

    public void salvarProgramacao(Long idAcampamento, AlertasPagamentoDTO.Programacao programacao) {
        Acampamento acampamento = acampamentoRepository.findById(idAcampamento).orElse(null);
        if (acampamento == null)
            throw new IllegalArgumentException("Acampamento não encontrado.");

        boolean ativo = Boolean.TRUE.equals(programacao.ativo());
        Integer intervalo = programacao.intervaloDias();
        if (ativo && (intervalo == null || intervalo < 1 || intervalo > 60))
            throw new IllegalArgumentException("Informe de quantos em quantos dias enviar (entre 1 e 60).");

        acampamento.setLembreteAtivoAcampamento(ativo);
        // desligando, mantém o intervalo antigo para não precisar digitar de novo ao religar
        if (intervalo != null)
            acampamento.setLembreteIntervaloDiasAcampamento(intervalo);
        acampamentoRepository.save(acampamento);
    }

    // Regra usada pelo agendador: este acampamento deve receber o envio automático HOJE?
    public boolean deveEnviarHoje(Acampamento acampamento) {
        if (!isLembreteAtivo(acampamento) || acampamento.getLembreteIntervaloDiasAcampamento() == null)
            return false;

        LocalDate hoje = LocalDate.now();
        if (!hoje.isBefore(paraLocalDate(acampamento.getDataInicioAcampamento())))
            return false; // acampamento já começou: não cobra mais por e-mail

        LocalDate ultimo = acampamento.getLembreteUltimoEnvioAcampamento();
        if (ultimo == null)
            return true; // nunca enviou: envia na primeira oportunidade

        // já passaram X dias desde o último envio? (se o backend ficou desligado, envia no próximo dia que estiver ligado)
        return !hoje.isBefore(ultimo.plusDays(acampamento.getLembreteIntervaloDiasAcampamento()));
    }

    // Só para mostrar na tela: em que dia o agendador vai enviar de novo
    private LocalDate calcularProximoEnvio(Acampamento acampamento) {
        if (!isLembreteAtivo(acampamento) || acampamento.getLembreteIntervaloDiasAcampamento() == null)
            return null;

        // próxima vez que o agendador roda: hoje (se ainda não deu o horário) ou amanhã
        LocalDate hoje = LocalDate.now();
        LocalDate proximaExecucao = LocalTime.now().getHour() < HORA_ENVIO_AUTOMATICO ? hoje : hoje.plusDays(1);

        LocalDate ultimo = acampamento.getLembreteUltimoEnvioAcampamento();
        LocalDate proximo = proximaExecucao;
        if (ultimo != null) {
            LocalDate vencimento = ultimo.plusDays(acampamento.getLembreteIntervaloDiasAcampamento());
            if (vencimento.isAfter(proximaExecucao))
                proximo = vencimento;
        }

        // se o acampamento já tiver começado nesse dia, não haverá envio
        if (!proximo.isBefore(paraLocalDate(acampamento.getDataInicioAcampamento())))
            return null;
        return proximo;
    }

    private boolean isLembreteAtivo(Acampamento acampamento) {
        return Boolean.TRUE.equals(acampamento.getLembreteAtivoAcampamento());
    }

    // ===================== Envio =====================

    // Envia o lembrete para UMA inscrição. Lança IllegalArgumentException com a mensagem para a tela.
    public String enviarParaUm(Long idInscricao) {
        InscricaoAcampamento inscricao = inscricaoRepository.findById(idInscricao).orElse(null);
        if (inscricao == null)
            throw new IllegalArgumentException("Inscrição não encontrada.");
        if (inscricao.getStatusAprovacao() != InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE)
            throw new IllegalArgumentException("Esta inscrição não está com pagamento pendente.");

        enviarEmail(inscricao);
        return "E-mail enviado para " + inscricao.getUsuario().getNomeUsuario() + ".";
    }

    // Envia para TODOS os pendentes do acampamento. Uma falha não interrompe os outros envios.
    // Também é o que o envio automático (parte 3) vai chamar.
    public AlertasPagamentoDTO.ResultadoEnvio enviarParaTodos(Long idAcampamento) {
        Acampamento acampamento = acampamentoRepository.findById(idAcampamento).orElse(null);
        if (acampamento == null)
            throw new IllegalArgumentException("Acampamento não encontrado.");

        int enviados = 0;
        List<String> falhas = new ArrayList<>();
        for (InscricaoAcampamento inscricao : buscarPendentes(idAcampamento)) {
            try {
                enviarEmail(inscricao);
                enviados++;
            } catch (IllegalArgumentException | MailException e) {
                falhas.add(inscricao.getUsuario().getNomeUsuario() + ": " + e.getMessage());
            }
        }

        // Guarda a data do envio para o agendamento saber quando é o próximo
        if (enviados > 0) {
            acampamento.setLembreteUltimoEnvioAcampamento(LocalDate.now());
            acampamentoRepository.save(acampamento);
        }
        return new AlertasPagamentoDTO.ResultadoEnvio(enviados, falhas);
    }

    // Monta e envia o e-mail de uma inscrição
    private void enviarEmail(InscricaoAcampamento inscricao) {
        if (!isEmailConfigurado())
            throw new IllegalArgumentException("Envio de e-mail não configurado no servidor (spring.mail no application.properties).");

        Usuario usuario = inscricao.getUsuario();
        String email = usuario.getEmailUsuario();
        if (email == null || email.isBlank())
            throw new IllegalArgumentException("Usuário sem e-mail cadastrado.");

        Acampamento acampamento = inscricao.getAcampamento();
        Double valor = valorDaInscricao(inscricao);

        StringBuilder texto = new StringBuilder();
        texto.append("Olá, ").append(usuario.getNomeUsuario()).append("!\n\n");
        texto.append("Sua inscrição como ").append(inscricao.getFuncaoAcampamento())
                .append(" no acampamento ").append(acampamento.getNomeAcampamento())
                .append(" (início em ").append(paraLocalDate(acampamento.getDataInicioAcampamento()).format(FORMATO_DATA))
                .append(") ainda está com o pagamento pendente.\n\n");
        if (valor != null)
            texto.append("Valor: ").append(formatarDinheiro(valor)).append("\n\n");
        texto.append("Como pagar:\n");
        if (acampamento.isAceitaPagamentoOnline())
            texto.append("- Online: acesse ").append(urlFrontend)
                    .append("/inscricao/resposta e clique em \"Pagar online\".\n");
        texto.append("- Dinheiro ou PIX: procure a coordenação do acampamento.\n\n");
        texto.append("Se você já fez o pagamento, desconsidere esta mensagem.\n\n");

        // Responsável pelo acampamento: as respostas do e-mail vão direto para ele (Reply-To)
        Usuario responsavel = acampamento.getUsuario();
        boolean temResponsavel = responsavel != null && responsavel.getEmailUsuario() != null && !responsavel.getEmailUsuario().isBlank();
        if (temResponsavel)
            texto.append("Dúvidas ou comprovante? É só responder este e-mail que ")
                    .append(responsavel.getNomeUsuario()).append(", da coordenação, recebe.\n\n");

        texto.append("Paróquia São Miguel");

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(email);
        if (temResponsavel)
            mensagem.setReplyTo(responsavel.getEmailUsuario()); // "Responder" no e-mail vai para o coordenador, não para a conta do sistema
        mensagem.setSubject("Pagamento pendente - " + acampamento.getNomeAcampamento());
        mensagem.setText(texto.toString());
        mailSender.send(mensagem); // se o Gmail recusar, lança MailException
    }

    // ===================== Auxiliares =====================

    public boolean isEmailConfigurado() {
        return mailSender != null && remetente != null && !remetente.isBlank();
    }

    private List<InscricaoAcampamento> buscarPendentes(Long idAcampamento) {
        return inscricaoRepository.findByAcampamentoIdAcampamentoAndStatusAprovacao(
                idAcampamento, InscricaoAcampamentoStatus.PAGAMENTO_PENDENTE);
    }

    // Preço vem do formulário da função (campista paga um valor, servo outro)
    private Double valorDaInscricao(InscricaoAcampamento inscricao) {
        TipoFormulario tipo = "CAMPISTA".equals(inscricao.getFuncaoAcampamento()) ? TipoFormulario.CAMPISTA : TipoFormulario.SERVO;
        Formulario formulario = formularioRepository.findFirstByAcampamentoIdAcampamentoAndTipoFormulario(
                inscricao.getAcampamento().getIdAcampamento(), tipo);
        return formulario == null ? null : formulario.getPrecoFormulario();
    }

    // O front grava a data como meia-noite em UTC (ex.: 27/08 00:00Z, que no banco aparece como 26/08 21:00 de Brasília).
    // Por isso o dia é lido em UTC; com o fuso do servidor o e-mail mostraria um dia a menos.
    // new Date(getTime()) evita o erro do java.sql.Date com toInstant().
    private LocalDate paraLocalDate(Date data) {
        return new Date(data.getTime()).toInstant().atZone(ZoneOffset.UTC).toLocalDate();
    }

    private String formatarDinheiro(double valor) {
        return String.format(Locale.of("pt", "BR"), "R$ %,.2f", valor);
    }
}
