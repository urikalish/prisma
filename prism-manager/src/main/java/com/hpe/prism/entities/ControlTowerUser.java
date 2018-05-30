package com.hpe.prism.entities;

import org.hibernate.validator.constraints.NotBlank;

import lombok.Data;
import lombok.NonNull;

@Data
public class ControlTowerUser {
    
    @NonNull
    @NotBlank
    private String userName;
    
    @NonNull
    @NotBlank
    private String userFirstName;
    
    @NonNull
    @NotBlank
    private String userLastName;
    
    @NonNull
    @NotBlank
    private String uuid;
    
}
