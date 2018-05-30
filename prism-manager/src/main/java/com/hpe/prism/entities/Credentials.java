package com.hpe.prism.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Credentials {

    @NonNull
    private String loginName;

    @NonNull
    private String password;

}
