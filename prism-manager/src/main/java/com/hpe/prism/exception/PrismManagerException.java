package com.hpe.prism.exception;

public class PrismManagerException extends RuntimeException {
    
    private static final long serialVersionUID = -4071743767211445451L;
    
    public PrismManagerException(String message) {
        
        super(message);
    }
    
    public PrismManagerException(String message, Throwable thrown) {
        
        super(message, thrown);
    }
}
