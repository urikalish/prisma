package com.hpe.prism.dto;

import org.hibernate.validator.constraints.NotBlank;

public class EnvironmentDTO {

    @NotBlank
    private String envName;

    @NotBlank
    private String tenantId;
}
