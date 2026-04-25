package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.Comunidade;
import br.com.paroquia.backend.repositories.ComunidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComunidadeService {

    @Autowired
    private ComunidadeRepository comunidadeRepository;

    public List<Comunidade> getAllComunidades() {
        return comunidadeRepository.findAll();
    }

    public Comunidade getNameComunidade(String nomeComunidade) {
        return comunidadeRepository.findByNomeComunidade(nomeComunidade);
    }

    public Comunidade getIdComunidade(Long idComunidade) {
        return comunidadeRepository.findById(idComunidade).orElse(null);
    }

    public Comunidade salvarComunidade(Comunidade comunidade) {
        try{
            Comunidade novaComunidade = comunidadeRepository.save(comunidade);
            return novaComunidade;
        }catch (Exception e){
            return null;
        }
    }

    public boolean excluirComunidade(Long idComunidade) {
        try{
            comunidadeRepository.deleteById(idComunidade);
            return true;
        } catch (Exception e) {
            System.err.println("Erro ao deletar: " + e.getMessage());
        }
        return false;
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