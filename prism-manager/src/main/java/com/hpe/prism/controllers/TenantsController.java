package com.hpe.prism.controllers;

import com.hpe.prism.dto.TenantDTO;
import com.hpe.prism.services.TenantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/rest/tenants")
@EnableWebSecurity
public class TenantsController {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());
    
    private static final String LOGIN_NAME_ERROR_MESSAGE =
            "Required String parameter 'loginName' cannot be null or empty.";
    
    @Autowired
    private TenantService tenantServices;
    
    @GetMapping
    public ResponseEntity<List<TenantDTO>> getUserALMOctaneTenants(
            @RequestParam(value = "loginName") String loginName) {
        if (StringUtils.isEmpty(loginName)) {
            logger.error(LOGIN_NAME_ERROR_MESSAGE);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Reason-Phrase", LOGIN_NAME_ERROR_MESSAGE);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        List<TenantDTO> tenants = tenantServices.getUserALMOctaneTenants(loginName);
        if (tenants == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Reason-Phrase", "Could not create get user's tenants.");
            return new ResponseEntity<>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        return new ResponseEntity<>(tenants, HttpStatus.OK);

    }
}
