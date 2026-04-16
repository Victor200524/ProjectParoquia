package br.com.paroquia.backend.repositories;

import br.com.paroquia.backend.entities.HorarioMissa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioMissaRepository extends JpaRepository<HorarioMissa, Long> {
    List<HorarioMissa> findBySemanaMissa(String semanaMissa);
}