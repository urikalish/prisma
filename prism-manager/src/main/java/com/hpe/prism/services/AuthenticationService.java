package com.hpe.prism.services;

import java.io.IOException;
import java.util.Arrays;

import javax.annotation.security.PermitAll;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hp.hpsso.Constants;
import com.hpe.prism.config.ManagerConfiguration;
import com.hpe.prism.dto.AccessTokenDTO;
import com.hpe.prism.entities.ControlTowerUser;
import com.hpe.prism.entities.Credentials;

@Service
public class AuthenticationService {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private ManagerConfiguration managerConfiguration;

    private ObjectMapper mapper = new ObjectMapper();
    
    private final String CREATE_HPSSO_TOKEN_URL = "rest/openapi/hpssoservice/getToken";
    private final String CREATE_OAUTH2_CLIENT_URL = "rest/oauth2/client/create";
    private final String CREATE_IMPLICIT_OAUTH2_TOKEN_URL = "rest-ext/oauth2/token/authorize";
    private final String DECRYPT_ACCESS_TOKEN_URL = "rest/openapi/hpssoservice/decrypt";
    private final String SCOPE_TEMPLATE = "scope=tenantid:%s permission:prisma.agent";

    @PermitAll
    @Transactional(readOnly = true)
    public Credentials generateCredentials(String tenantId) {
        logger.info(String.format(
                "Generating credentials for tenant with tenant id: [%s]",
                tenantId));
        final String scope = getScope(tenantId);
        
        final String credentials;
        try {
            credentials = createCredentials(getIntegrationUserSsoToken(), scope);
        } catch (Exception e) {
            logger.error("Failed to create credentials.", e);
            return null;
        }
        
        try {
            return mapper.readValue(credentials, Credentials.class);
        } catch (IOException e) {
            logger.error(String.format("Failed to deserialize credentials: [%s].", credentials), e);
            return null;
        }
    }
    
    @PermitAll
    @Transactional(readOnly = true)
    public ControlTowerUser ssoTokenToControlTowerUser(String ssoToken) {
        logger.debug(String.format("Getting detail for user with sso-token [%s]", ssoToken));
        try {
            String data = decryptSsoToken(ssoToken);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode securityContext = mapper.readTree(data).get("securityContext");
            String userName = securityContext.get("userName").textValue();
            JsonNode attributes = securityContext.get("attributes");
            String userFirstName = attributes.get("USERFIRSTNAME").textValue();
            String userLastName = attributes.get("USERLASTNAME").textValue();
            String UUID = attributes.get("UUID").textValue();
            return new ControlTowerUser(userName, userFirstName, userLastName, UUID);
        } catch (Exception e) {
            logger.error(
                    String.format(
                            "Failed to decrypt sso-token [%s]. Reason: [%s]",
                            ssoToken,
                            e.getMessage()),
                    e);
            return null;
        }
    }
    
    @PermitAll
    @Transactional(readOnly = true)
    public String getIntegrationUserSsoToken() {
        return createSSOToken(managerConfiguration.getManagerCredentials());
    }

    private String decryptSsoToken(String ssoToken) {
        logger.debug(String.format(
                "Calling \"decryptSsoToken\" for user with sso-token [%s]",
                ssoToken));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        
        AccessTokenDTO accessTokenDTO = new AccessTokenDTO(ssoToken);
        String accessTokenDTOString = mapper.valueToTree(accessTokenDTO).toString();
        HttpEntity<String> entity = new HttpEntity<>(accessTokenDTOString, headers);
        
        String url = managerConfiguration.getMsgUrl() + DECRYPT_ACCESS_TOKEN_URL;
        
        return postRequest(url, entity).getBody();
    }

    private String createSSOToken(Credentials credentials) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String userCredentials = mapper.valueToTree(credentials).toString();
        HttpEntity<String> entity = new HttpEntity<>(userCredentials, headers);

        String url = managerConfiguration.getMsgUrl() + CREATE_HPSSO_TOKEN_URL;
        
        return postRequest(url, entity).getBody();
    }
    
    private String createCredentials(String ssoToken, String scope) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.add(HttpHeaders.COOKIE, Constants.LWSSO_COOKIE_KEY + "=" + ssoToken);
        HttpEntity<String> entity = new HttpEntity<>(scope, headers);
        
        String url = managerConfiguration.getMsgUrl() + CREATE_OAUTH2_CLIENT_URL;
        
        return postRequest(url, entity).getBody();
    }
    
    private String createImplicitOauth2Token(String ssoToken, String scope) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.add(HttpHeaders.COOKIE, Constants.LWSSO_COOKIE_KEY + "=" + ssoToken);
        
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("scope", scope);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        
        String url = managerConfiguration.getMsgExtUrl() + CREATE_IMPLICIT_OAUTH2_TOKEN_URL;
        
        return new RestTemplate().postForEntity(url, request, String.class).getBody();
    }
    
    private ResponseEntity<String> postRequest(String url, HttpEntity<String> entity) {
        ResponseEntity<String> ret;
        
        try {
            ResponseEntity<String> response =
                    new RestTemplate().exchange(url, HttpMethod.POST, entity, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                ret = new ResponseEntity<>(response.getBody(), HttpStatus.OK);
            } else {
                ret = new ResponseEntity<>(response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            ret = new ResponseEntity<>(e.getMessage(), e.getStatusCode());
        }
        
        return ret;
    }
    
    private String getScope(String tenantId) {
        return String.format(SCOPE_TEMPLATE, tenantId);
    }
}
