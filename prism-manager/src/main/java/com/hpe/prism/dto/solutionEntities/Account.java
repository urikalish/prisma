package com.hpe.prism.dto.solutionEntities;

import org.hibernate.validator.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NonNull;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Account {
    
    @NonNull
    @NotBlank
    String accountId;
    
    @NonNull
    @NotBlank
    String accountName;
    
    @NonNull
    @NotBlank
    String displayName;
    
    @NonNull
    Solution[] solutions;
}
