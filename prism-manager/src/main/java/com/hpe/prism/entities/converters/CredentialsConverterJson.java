package com.hpe.prism.entities.converters;

import java.io.IOException;

import javax.persistence.AttributeConverter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hpe.prism.entities.Credentials;

public class CredentialsConverterJson implements AttributeConverter<Credentials, String> {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());
    private final static ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public String convertToDatabaseColumn(Credentials credentials) {
        try {
            return objectMapper.writeValueAsString(credentials);
        } catch (JsonProcessingException ex) {
            logger.error("Unexpected JsonProcessingException decoding json from database: "
                         + credentials);
            return null;
        }
    }
    
    @Override
    public Credentials convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, Credentials.class);
        } catch (IOException ex) {
            logger.error("Unexpected IOEx decoding json from database: " + dbData);
            return null;
        }
    }
    
}
