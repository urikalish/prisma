package com.hpe.prism.dto.solutionEntities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NonNull;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Tenant {
    
    @NonNull
    private String tenantId;
}
