package com.hpe.prism.dto;

import org.hibernate.validator.constraints.NotBlank;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class TenantDTO {
    
    public TenantDTO(String solutionName, String instanceName, String tenantId, String loginUrl) {
        this.solutionName = solutionName;
        this.instanceName = instanceName;
        this.tenantId = tenantId;
        this.loginUrl = loginUrl;
    }
    
    @NonNull
    @NotBlank
    String solutionName;
    
    @NonNull
    @NotBlank
    String instanceName;
    
    @NonNull
    @NotBlank
    String tenantId;
    
    String loginUrl;
}
