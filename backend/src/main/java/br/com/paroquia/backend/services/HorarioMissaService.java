package br.com.paroquia.backend.services;

import br.com.paroquia.backend.entities.HorarioMissa;
import br.com.paroquia.backend.repositories.HorarioMissaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HorarioMissaService {

    @Autowired
    private HorarioMissaRepository horarioMissaRepository;

    public List<HorarioMissa> getAllHorarios() {
        return horarioMissaRepository.findAll();
    }

    public List<HorarioMissa> getHorariosPorDia(String semanaMissa) {
        return horarioMissaRepository.findBySemanaMissa(semanaMissa);
    }

    public HorarioMissa getIdHorario(Long idHorarioMissa) {
        Optional<HorarioMissa> horario = horarioMissaRepository.findById(idHorarioMissa);
        return horario.orElse(null);
    }

    public HorarioMissa salvarHorario(HorarioMissa horarioMissa) {
        return horarioMissaRepository.save(horarioMissa);
    }

    public boolean excluirHorario(Long idHorarioMissa) {
        try{
            horarioMissaRepository.deleteById(idHorarioMissa);
            return true;
        } catch (Exception e) {
            System.err.println("Erro ao deletar: " + e.getMessage());
        }
        return false;
    }
}