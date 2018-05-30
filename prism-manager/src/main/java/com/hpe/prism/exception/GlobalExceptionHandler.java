package com.hpe.prism.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());
    
    @ExceptionHandler(Exception.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public String resolveException(HttpServletRequest request, Exception e) {
        if (request.getParameterMap() != null && request.getParameterMap().size() > 0) {
            logger.error(
                    "Bad Request: {} with params: {}",
                    request.getRequestURI(),
                    request.getParameterMap(),
                    e);
        } else {
            logger.error("Bad request: {}", request.getRequestURI(), e);
        }
        
        String message = "Bad request";
        if (!StringUtils.isEmpty(e.getMessage())) {
            message = String.format("%s: %s", message, e.getMessage());
        }
        return message;
    }

    @ExceptionHandler(PrismApplicationNotFoundException.class)
    @ResponseStatus(NOT_FOUND)
    @ResponseBody
    public String resolveNotFoundException(HttpServletRequest request, Exception e) {
        String message = "No such Application";
        logger.error("{}: {}", request.getRequestURI(), e);

        if (!StringUtils.isEmpty(e.getMessage())) {
            message = String.format("%s: %s", message, e.getMessage());
        }
        return message;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public String resolveMessageNotReadableException(HttpServletRequest request, Exception e) {
        String message = "Message Not Readable";
        logger.error("{}: {}", message, request.getRequestURI(), e);


        if (e.getCause() != null && !StringUtils.isEmpty(e.getCause().getMessage())) {
            message = String.format("%s: %s", message, e.getCause().getMessage());
        }
        return message;
    }
}
