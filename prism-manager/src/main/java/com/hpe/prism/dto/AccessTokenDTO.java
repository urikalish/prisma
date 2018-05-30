package com.hpe.prism.dto;

import org.hibernate.validator.constraints.NotBlank;

import lombok.Data;
import lombok.NonNull;

@Data
public class AccessTokenDTO {
    
    @NonNull
    @NotBlank
    private String token;
}
