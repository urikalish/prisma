package com.hpe.prism.services;

import com.hpe.prism.entities.Application;
import com.hpe.prism.entities.ControlTowerUser;
import com.hpe.prism.entities.Credentials;
import com.hpe.prism.entities.Environment;
import com.hpe.prism.exception.PrismApplicationNotFoundException;
import com.hpe.prism.repositories.ApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.security.PermitAll;
import java.util.Date;
import java.util.List;

@Service
public class ApplicationService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private AuthenticationService authenticationService;

    @PermitAll
    @Transactional(readOnly = true)
    public List<Application> readApplications() {
        logger.info("Getting all applications");
        return applicationRepository.findAll();
    }

    @PermitAll
    @Transactional(readOnly = true)
    public List<Application> readApplicationsByTenantId(String tenantId) {
        logger.info(String.format("Getting all applications for <tenantId=%s>",tenantId));
        return applicationRepository.findByTenantId(tenantId);
    }

    @PermitAll
    @Transactional(readOnly = true)
    protected Application readApplication(Long applicationId) {
        logger.info(String.format("Getting application with <applicationId=%s>", applicationId));
        return applicationRepository.findOne(applicationId);
    }

    @PermitAll
    @Transactional
    public Application createApplication(
            ControlTowerUser controlTowerUser,
            String appName,
            String tenantId) {
        logger.info(String.format(
                "Creating application: <Application name: [%s], Tenant id: [%s]>",
                appName,
                tenantId));
        Application ret = applicationRepository.findByAppNameAndTenantId(appName, tenantId);

        if (ret == null) {
            final Credentials writeCredentials =
                    authenticationService.generateCredentials(tenantId);
            if (writeCredentials != null) {
                Application application =
                        new Application(
                                controlTowerUser,
                                new Date(),
                                appName,
                                tenantId,
                                writeCredentials);
                ret = applicationRepository.save(application);
                logger.info(String.format(
                        "Application created: <Application name: [%s], Tenant id: [%s]>",
                        appName,
                        tenantId));
            } else {
                logger.info(String.format(
                        "Application already exists: <Application name: [%s], Tenant id: [%s]>",
                        appName,
                        tenantId));
            }
        }

        return ret;
    }

    @PermitAll
    @Transactional
    public Application addEnvironmentToApplication(long applicationId, Environment environment) {
        logger.info(String.format(
                "Adding environment to application: <applicationId: [%d], environment: [%s]>",
                applicationId,
                environment.toString()));
        Application application = readApplication(applicationId);
        if (application == null) {
            throw new PrismApplicationNotFoundException(String.format("Application with id %s not found.", applicationId));
        }

        if (!isEnvironmentExists(application.getEnvironments(), environment)) {
            application.getEnvironments().add(environment);
        } else {
            application.getEnvironments().stream().filter(
                    env -> env.getEnvironmentName().equals(environment.getEnvironmentName())).forEach(
                            env -> env.setDefaultEventType(environment.getDefaultEventType()));
        }

        return application;
    }

    private boolean isEnvironmentExists(List<Environment> environments, Environment environment) {
        return environments.stream().filter(
                env -> env.getEnvironmentName().equals(environment.getEnvironmentName())).count() > 0;
    }
}
