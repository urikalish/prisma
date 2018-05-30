package com.hpe.prism.dto.solutionEntities;

import org.hibernate.validator.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Instance {
    
    @NonNull
    @NotBlank
    String instanceName;
    
    @NonNull
    @NotBlank
    String instanceId;
    
    String loginUrl;
    
    @NonNull
    Tenant[] tenants;
}
