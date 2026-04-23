package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getAllUsers(){
        return usuarioRepository.findAll();
    }

    // Faz parte do login e da busca do usuário através do email
    public Usuario getUserEmail(String email) {
        return usuarioRepository.findByEmailUsuario(email);
    }
    public Usuario getCpfUsuario(String cpf){
        return usuarioRepository.findByCpfUsuario(cpf);
    }

    // Serve somente para o login
    public boolean verificarLogin(String cpf, String senha) {
        Usuario usuario = usuarioRepository.findByCpfUsuario(cpf);
        return isCpfValido(cpf) && usuario.getSenhaUsuario().equals(senha);
    }

    public Usuario getUserId(Long idUsuario){
        return usuarioRepository.findById(idUsuario).orElse(null);
    }

    public boolean excluirUsuario(Long idUsuario) {
        try{
            usuarioRepository.deleteById(idUsuario);
            return true;
        } catch (Exception e) {
            System.err.println("Erro ao deletar: " + e.getMessage());
        }
        return false;
    }


    // --- Validação do Email ---
    public boolean isFormatoEmailValido(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        String regex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(regex);
    }

    // Metodo principal de cadastro
    public Usuario saveUsuario(Usuario novoUsuario) {
        if (!isFormatoEmailValido(novoUsuario.getEmailUsuario()))
            throw new IllegalArgumentException("Formato de e-mail inválido!");

        if (getUserEmail(novoUsuario.getEmailUsuario()) != null)
            throw new IllegalArgumentException("Este e-mail já está em uso na paróquia!");
        if (!isCpfValido(novoUsuario.getCpfUsuario()))
            throw new IllegalArgumentException("CPF inválido!");

        novoUsuario.setStatusUsuario(0); // (0 = Pendente, 1 = Ativo)
        return usuarioRepository.save(novoUsuario);
    }

    // --- Validação de CPF ---
    public boolean isCpfValido(String cpf) {
        if (cpf == null)
            return false;
        cpf = cpf.replaceAll("\\D", ""); // Remove qualquer formatação (pontos e traços) que vier do Front-end


        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) // Verifica se tem 11 dígitos ou se é uma sequência repetida
            return false;

        try {
            int soma = 0, peso = 10;
            for (int i = 0; i < 9; i++) {
                soma += (cpf.charAt(i) - '0') * peso--;
            }
            int r = 11 - (soma % 11);
            char dig10 = (r == 10 || r == 11) ? '0' : (char) (r + '0');

            soma = 0; peso = 11;
            for (int i = 0; i < 10; i++) {
                soma += (cpf.charAt(i) - '0') * peso--;
            }
            r = 11 - (soma % 11);
            char dig11 = (r == 10 || r == 11) ? '0' : (char) (r + '0');

            // Retorna true se os dígitos calculados batem com os informados no cpf pelo usuário
            return (dig10 == cpf.charAt(9)) && (dig11 == cpf.charAt(10));
        } catch (Exception e) {
            return false;
        }
    }
}
