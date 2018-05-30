package com.hpe.prism.dto;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

@Data
public class ApplicationDTO {

    @NotBlank
    private String appName;

    @NotBlank
    private String tenantId;
}
