package com.hpe.prism.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hpe.prism.entities.Application;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    Application findByAppNameAndTenantId(String appName, String tenantId);

    List<Application> findByTenantId(String tenantId);
}
