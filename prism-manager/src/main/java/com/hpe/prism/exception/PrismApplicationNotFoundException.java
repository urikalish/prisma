package com.hpe.prism.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.NOT_FOUND, reason="No such Application")
public class PrismApplicationNotFoundException extends PrismManagerException{
    public PrismApplicationNotFoundException(String message) {
        super(message);
    }
}

