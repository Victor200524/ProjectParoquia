package br.com.paroquia.backend.services;

import br.com.paroquia.backend.repositories.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PagamentoService {
    @Autowired
    PagamentoRepository pagamentoRepository;

}
