package com.hpe.prism.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Table
public class Environment {
    
    @Id
    @GeneratedValue
    private Long id;
    
    @NonNull
    @NotBlank
    private String environmentName;

    @Enumerated(EnumType.STRING)
//    @Column(name = "default_event_type")
    @NonNull
    private DefaultEventType defaultEventType;
}
