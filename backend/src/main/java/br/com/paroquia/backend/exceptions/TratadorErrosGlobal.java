package br.com.paroquia.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Arrays;

// Vale para todos os controllers: quando um parâmetro da URL vem com valor que não dá para converter
// (ex.: ?formaPagamento=CHEQUE ou /buscar/abc num id numérico), devolve uma mensagem curta em vez do erro do Spring
@RestControllerAdvice
public class TratadorErrosGlobal {

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> parametroInvalido(MethodArgumentTypeMismatchException e) {
        String mensagem = "Valor inválido para '" + e.getName() + "': " + e.getValue();

        // se o parâmetro é um enum, já mostra quais valores são aceitos
        Class<?> tipo = e.getRequiredType();
        if (tipo != null && tipo.isEnum()) {
            mensagem += ". Use: " + String.join(", ", Arrays.stream(tipo.getEnumConstants()).map(Object::toString).toList());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mensagem);
    }
}
