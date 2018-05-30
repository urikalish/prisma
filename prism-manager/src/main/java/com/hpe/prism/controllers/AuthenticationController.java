package com.hpe.prism.controllers;

import com.hp.hpsso.Constants;
import com.hpe.prism.dto.ApplicationDTO;
import com.hpe.prism.entities.Application;
import com.hpe.prism.entities.ControlTowerUser;
import com.hpe.prism.repositories.ApplicationRepository;
import com.hpe.prism.services.AuthenticationService;
import org.h2.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;

@Controller
@RequestMapping("/rest/authentication")
@EnableWebSecurity
public class AuthenticationController {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    //TODO: remove this class after Ohad will implement in the extension
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @PostMapping(path = "/read-access-token")
    public void createReadAccessToken(
            HttpServletResponse response,
            @CookieValue(Constants.LWSSO_COOKIE_KEY) String ssoToken,
            @RequestBody @Valid ApplicationDTO applicationDto) throws IOException {
        logger.info(String.format("got create read-access-token request."));

        String appName = applicationDto.getAppName();
        String tenantId = applicationDto.getTenantId();
        
        if (StringUtils.isNullOrEmpty(ssoToken)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }
        
        final Application application =
                applicationRepository.findByAppNameAndTenantId(appName, tenantId);
        if (application == null) {
            response.setStatus(HttpStatus.NOT_FOUND.value());
            return;
        }
        ControlTowerUser userDetails = authenticationService.ssoTokenToControlTowerUser(ssoToken);
    }
}
