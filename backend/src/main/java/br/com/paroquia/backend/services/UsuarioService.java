package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Usuario;
import br.com.paroquia.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getAllUsarios(){
        return usuarioRepository.findAll();
    }
    public Usuario getUserEmail(String email) {
        return usuarioRepository.findByEmailUsuario(email);
    }
    public Usuario getCpfUsuario(String cpf){
        return usuarioRepository.findByCpfUsuario(cpf);
    }
    public Usuario getUserId(Long idUsuario){
        return usuarioRepository.findById(idUsuario).orElse(null);
    }
    public Usuario getContatoUsuasrio(String contato){
        return usuarioRepository.findByContatoUsuario(contato);
    }


    // Serve somente para o login
    public boolean verificarLogin(String cpf, String senha, String contato) {
        Usuario usuario = usuarioRepository.findByCpfUsuario(cpf);
        return isCpfValido(cpf) && usuario.getSenhaUsuario().equals(senha) && isTelefoneValido(contato);
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

    // ============================================ Validações ================================================================
    // --- Validação do Email ---
    public boolean isFormatoEmailValido(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        String regex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(regex);
    }

    // --- Validação de CPF ---
    public boolean isCpfValido(String cpf) {
        if (cpf == null)
            return false;
        cpf = cpf.replaceAll("\\D", "");


        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}"))
            return false;

        try {
            int soma = 0, peso = 10;
            for (int i = 0; i < 9; i++)
                soma += (cpf.charAt(i) - '0') * peso--;

            int r = 11 - (soma % 11);
            char dig10 = (r == 10 || r == 11) ? '0' : (char) (r + '0');

            soma = 0; peso = 11;
            for (int i = 0; i < 10; i++)
                soma += (cpf.charAt(i) - '0') * peso--;

            r = 11 - (soma % 11);
            char dig11 = (r == 10 || r == 11) ? '0' : (char) (r + '0');

            // Retorna true se os dígitos calculados batem com os informados no cpf pelo usuário
            return (dig10 == cpf.charAt(9)) && (dig11 == cpf.charAt(10));
        } catch (Exception e) {
            return false;
        }
    }

    // --- Validar Contato ---
    public boolean isTelefoneValido(String telefone) {
        if (telefone == null || telefone.trim().isEmpty())
            return true;

        String numeros = telefone.replaceAll("\\D", "");

        if (numeros.length() < 10 || numeros.length() > 11)
            return false;

        if (numeros.length() == 11 && numeros.charAt(2) != '9')
            return false;

        String ddd = numeros.substring(0, 2);
        if (Integer.parseInt(ddd) < 11)
            return false;

        return true;
    }
}
