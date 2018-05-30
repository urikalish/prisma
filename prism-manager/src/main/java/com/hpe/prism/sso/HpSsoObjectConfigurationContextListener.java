package com.hpe.prism.sso;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletContextEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.hp.hpsso.HpSsoContextListener;
import com.hp.hpsso.configuration.ConfigurationFactory;
import com.hp.hpsso.configuration.SsoConfiguration;
import com.hp.hpsso.configuration.manager.ConfigurationManagementUtils;
import com.hp.hpsso.configuration.validation.AbstractValidatorConfig;
import com.hp.hpsso.configuration.validation.LwssoValidatorConfig;
import com.hp.hpsso.configuration.validation.MultiDomain;
import com.hp.hpsso.configuration.validation.OnFailure;
import com.hp.hpsso.configuration.validation.ValidationConfig;
import com.hp.hpsso.exception.HpSsoBaseException;
import com.hpe.prism.config.ManagerConfiguration;

@Component
public class HpSsoObjectConfigurationContextListener extends HpSsoContextListener {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());
    
    @Autowired
    private ManagerConfiguration managerConfiguration;
    
    @Override
    public void contextInitialized(ServletContextEvent context) {
        logger.debug("initializing... hp sso config");
        try {
            //instantiate a configuration object
            SsoConfiguration configuration = ConfigurationFactory.getSlaveConfiguration();

            //set the init string. make sure this is the same in other applications in the system
            configuration.getGlobal().getLwsso().getCrypto().setInitString(
                    managerConfiguration.getInitString());

            //Creation is needed only in on-premise
            //configuration.getCreation().setTokenGlobalTimeout(60);

            //set the domain. this must suit the domain of your server.
            //configuration.getGlobal().getLwsso().addCreationDomain("hpeswlab.net");

            configuration.getGlobal().getCSRFCookieConfig().setEnableSetCSRFCookie(true);
            configuration.getGlobal().getCSRFCookieConfig().setSecureCSRFCookie(true);

            configuration.getGlobal().getLwsso().setIntegrationUserAuth(null);
            ValidationConfig validation = configuration.getValidation();

            //Example for how to add logout url and non secure url
            //            validation.addLogoutUrl(".*/prism/doLogout.*");
            //            validation.addNonSecureURL(".*/prism/non-secured.*");
            validation.addNonSecureURL(".*heartbeat");

            //returnForbiddenStatus on-failure-action
            OnFailure returnForbiddenStatus = new OnFailure();
            returnForbiddenStatus.setName(OnFailure.OnFailureAction.returnStatusCode);
            returnForbiddenStatus.setCheckMDLogin(false);
            returnForbiddenStatus.setValue(HttpStatus.FORBIDDEN.toString());
            Set<String> includeForbiddenUrls = new HashSet<>();
            includeForbiddenUrls.add(".*/rest.*");
            returnForbiddenStatus.setIncludeUrls(includeForbiddenUrls);
            
            //redirect to authentication point on-failure-action
            OnFailure redirecToAppOnFailre = new OnFailure();
            redirecToAppOnFailre.setName(OnFailure.OnFailureAction.redirectToAP);
            redirecToAppOnFailre.setCheckMDLogin(true);
            redirecToAppOnFailre.setTargetUrl("https://msgalb002tex.saas.hpe.com/msg/actions/showLogin");
            redirecToAppOnFailre.addAttribute(OnFailure.URL_EXPIRATION_ATT_NAME, "60");
            Set<String> includeRedirectUrls = new HashSet<>();
            includeRedirectUrls.add(".*");
            redirecToAppOnFailre.setIncludeUrls(includeRedirectUrls);

            //add on failure list to validation
            List<OnFailure> onFailures = new ArrayList<>();
            onFailures.add(returnForbiddenStatus);
            onFailures.add(redirecToAppOnFailre);
            validation.setOnFailure(onFailures);

            //adding lwsso validator
            List<AbstractValidatorConfig> validators = new ArrayList<>();
            LwssoValidatorConfig lwssoValidatorConfig = new LwssoValidatorConfig();
            lwssoValidatorConfig.setMandatory(true);
            MultiDomain md = new MultiDomain();

            md.setLogoutUrl("/doLogout");
            md.setMDMmasterDomain("saas.hpe.com");
            md.setMDMasterLoginUrl("https://msgalb002tex.saas.hpe.com/msg/actions/showLogin");
            md.setMDMasterLogoutUrl("https://msgalb002tex.saas.hpe.com/msg/actions/killLwsso");
            lwssoValidatorConfig.setMultiDomain(md);
            validators.add(lwssoValidatorConfig);
            validation.setValidators(validators);

            ConfigurationManagementUtils.init(configuration);
            init();
        } catch (HpSsoBaseException e) {
            logger.error("Failed to initialize the HP SSO framework!", e);
        }
    }
}