package com.hpe.prism.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hp.hpsso.Constants;
import com.hpe.prism.config.ManagerConfiguration;
import com.hpe.prism.dto.TenantDTO;
import com.hpe.prism.dto.solutionEntities.Account;
import com.hpe.prism.dto.solutionEntities.Solution;
import com.hpe.prism.dto.solutionEntities.SolutionInstances;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.security.PermitAll;
import java.io.IOException;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

@Service
public class TenantService {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());
    
    private final String GET_SOLUTION_INSTANCES_URL =
            "internal-portal/service/v2/obtaining/getSolutionInstances";
    private final String LOGIN_NAME_PARAM_NAME = "loginName";
    private final String ALM_SOLUTION_NAME = "ALM";
    private final String OCTANE_SOLUTION_NAME = "ALM Octane";

    @Autowired
    private AuthenticationService authenticationService;
    
    @Autowired
    private ManagerConfiguration managerConfiguration;
    
    @PermitAll
    @Transactional(readOnly = true)
    public List<TenantDTO> getUserALMOctaneTenants(String userName) {
        List<TenantDTO> ret = null;

        try {
            logger.info(String.format("Getting tenants for user %s", userName));
            String solutions =
                    getSolutionInstancesForUser(
                            authenticationService.getIntegrationUserSsoToken(),
                            userName);
            SolutionInstances solutionInstances = deserializeSolutions(solutions);
            ret = extractTenantsDTOsFromAccounts(solutionInstances.getAccounts());
        } catch (IOException e) {
            logger.error(String.format("Failed to get tenants for user [%s].", userName), e);
        }
        
        return ret;
    }
    
    private SolutionInstances deserializeSolutions(String solutions) throws IOException {
        logger.info(String.format("Deserialize Solutions [%s]", solutions));
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(solutions, SolutionInstances.class);
        } catch (IOException e) {
            logger.error(String.format("Failed deserialize Solutions [%s]", solutions));
            throw e;
        }
    }
    
    private String getSolutionInstancesForUser(String ssoToken, String userName) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.COOKIE, Constants.LWSSO_COOKIE_KEY + "=" + ssoToken);
        HttpEntity<?> request = new HttpEntity<>(headers);
        
        String url = managerConfiguration.getBoLoginUrl() + GET_SOLUTION_INSTANCES_URL;
        UriComponentsBuilder builder =
                UriComponentsBuilder.fromHttpUrl(url).queryParam(LOGIN_NAME_PARAM_NAME, userName);
        
        logger.info(String.format("Getting solution instances for user [%s]", userName));
        return new RestTemplate().exchange(
                builder.build().encode().toUri(),
                HttpMethod.GET,
                request,
                String.class).getBody();
        
    }
    
    private List<TenantDTO> extractTenantsDTOsFromAccounts(Account[] accounts) {
        logger.info("Extracting tenants from accounts.");
        List<TenantDTO> ret = new LinkedList<>();
        Arrays.stream(accounts).forEach(
                account -> Arrays.stream(account.getSolutions()).filter(this::isALMOrOctaneSolution).forEach(
                        solution -> Arrays.stream(solution.getInstances()).forEach(
                                instance -> Arrays.stream(instance.getTenants()).forEach(
                                        tenant -> ret.add(new TenantDTO(
                                                solution.getSolutionName(),
                                                instance.getInstanceName(),
                                                tenant.getTenantId(),
                                                instance.getLoginUrl()))))));
        
        return ret;
    }
    
    private boolean isALMOrOctaneSolution(Solution solution) {
        return (solution.getSolutionName().equals(ALM_SOLUTION_NAME) || solution.getSolutionName().equals(
                OCTANE_SOLUTION_NAME));
    }
}
