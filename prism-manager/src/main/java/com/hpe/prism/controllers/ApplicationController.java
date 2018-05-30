package com.hpe.prism.controllers;

import com.hp.hpsso.Constants;
import com.hpe.prism.dto.ApplicationDTO;
import com.hpe.prism.entities.Application;
import com.hpe.prism.entities.ControlTowerUser;
import com.hpe.prism.entities.Environment;
import com.hpe.prism.services.ApplicationService;
import com.hpe.prism.services.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/rest/applications")
@EnableWebSecurity
public class ApplicationController {

    private final Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private AuthenticationService authenticationService;

    @GetMapping
    public ResponseEntity<List<Application>> getApplications() {
        logger.info("Got get applications request.");
        return new ResponseEntity<>(applicationService.readApplications(), HttpStatus.OK);
    }

    @GetMapping(path = "/{tenantId}")
    public ResponseEntity<List<Application>> getApplicationsByTenantId(@PathVariable("tenantId") String tenantId) {
        logger.info(String.format("Got 'get applications' request for tenant with <tenantId=%s>.", tenantId));
        return new ResponseEntity<>(applicationService.readApplicationsByTenantId(tenantId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Application> addApplication(
            @CookieValue(Constants.LWSSO_COOKIE_KEY) String ssoToken,
            @RequestBody @Valid ApplicationDTO applicationDto) {

        logger.info(String.format("Got 'add application' request. <applicationDto=%s>", applicationDto.toString()));

        ControlTowerUser userDetails = authenticationService.ssoTokenToControlTowerUser(ssoToken);

        if (userDetails == null) {
            logger.error("Control Tower User not found.");
            HttpHeaders headers = new HttpHeaders();
            headers.add("Reason-Phrase", "Control Tower User not found.");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Application application =
                applicationService.createApplication(
                        userDetails,
                        applicationDto.getAppName(),
                        applicationDto.getTenantId());

        if (application == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Reason-Phrase", "Could not create Application.");
            return new ResponseEntity<>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(application, HttpStatus.OK);
    }

    @PostMapping(path = "/{applicationId}/environment")
    public ResponseEntity<Application> addEnvironmentToApplication(
            @PathVariable("applicationId") long applicationId,
            @RequestBody @Valid Environment environment) {

        logger.info(String.format("Got 'add environment to application' request. <Application Id=%s, environment=%s>", applicationId, environment.toString()));
        return new ResponseEntity<>(applicationService.addEnvironmentToApplication(applicationId, environment), HttpStatus.OK);
    }

}
