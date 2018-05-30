package com.hpe.prism.config;


import com.hpe.prism.encryption.SecurityUtils;
import com.hpe.prism.entities.Credentials;
import com.hpe.prism.exception.PrismManagerException;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

@Data
@Component
@ConfigurationProperties(prefix = "authenticationConfiguration")
public class ManagerConfiguration {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());
    private static final String MANAGER_FOLDER_NAME = "prism-manager";
    private static final String MANAGER_CONFIG_FILE_NAME = "prism-manager.properties";
    private static final String KEY = "key";
    
    private String msgUrl;
    private String msgExtUrl;
    private String boLoginUrl;
    private String clientId;
    private String clientSecret;
    private String initString;
    private Credentials managerCredentials;
    
    @Value("#{ systemProperties['user.home'] }")
    private String userHomeDirPath;
    
    @PostConstruct
    private void init() {
        managerCredentials = new Credentials(clientId, getClientSecret());
    }
    
    public String getClientSecret() {
        try {
            return SecurityUtils.decrypt(clientSecret, getKey());
        } catch (Exception e) {
            throw new PrismManagerException("failed to decrypt", e);
        }
    }
    
    public String getInitString() {
        try {
            return SecurityUtils.decrypt(initString, getKey());
        } catch (Exception e) {
            throw new PrismManagerException("failed to decrypt", e);
        }
    }
    
    private String getKey() {
        try {
            Path path = Paths.get(userHomeDirPath, MANAGER_FOLDER_NAME, MANAGER_CONFIG_FILE_NAME);
            Properties properties = new Properties();
            properties.load(new FileInputStream(path.toString()));
            logger.info(String.format("going to read key from <%s>", path.toString()));
            String keyStr = properties.getProperty(KEY);
            if (keyStr == null) {
                throw new PrismManagerException("Could not find key");
            }
            
            return keyStr;
        } catch (Exception e) {
            throw new PrismManagerException(e.getMessage(), e);
        }
    }
}
