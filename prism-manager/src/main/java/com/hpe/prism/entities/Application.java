package com.hpe.prism.entities;

import java.io.Serializable;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.validator.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.hpe.prism.entities.converters.ControlTowerUserConverterJson;
import com.hpe.prism.entities.converters.CredentialsConverterJson;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Table(indexes = { @Index(name = "appname_tenantid_unq", unique = true, columnList = "appName,tenantId") })
public class Application implements Serializable {

    @Id
    @GeneratedValue
    private Long id;
    
    @NonNull
    @Convert(converter = ControlTowerUserConverterJson.class)
    private ControlTowerUser controlTowerUser;
    
    @NonNull
    private Date creationDate;

    @NonNull
    @NotBlank
    @JsonProperty("appName")
    private String appName;

    @NonNull
    @NotBlank
    @JsonProperty("tenantId")
    private String tenantId;

    @NonNull
    @Convert(converter = CredentialsConverterJson.class)
    private Credentials credentialsWrite;
    
    @NonNull
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Environment> environments = new LinkedList<>();

}
