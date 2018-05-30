package com.hpe.prism;

import javax.servlet.Filter;
import javax.servlet.ServletContextListener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import com.hp.hpsso.api.HpSsoFilter;
import com.hpe.prism.sso.HpSsoObjectConfigurationContextListener;

@Configuration
@ComponentScan
public class SSOWebConfig extends SpringBootServletInitializer {
    
    @Autowired
    private HpSsoObjectConfigurationContextListener hpSsoObjectConfigurationContextListener;

    @Bean
    public ServletListenerRegistrationBean<ServletContextListener> myServletListener() {
        ServletListenerRegistrationBean<ServletContextListener> srb =
                new ServletListenerRegistrationBean<>();
        srb.setListener(hpSsoObjectConfigurationContextListener);
        return srb;
    }
    
    @Bean
    public Filter HpSsoFilter() {
        return new HpSsoFilter();
    }

    @Bean
    public FilterRegistrationBean hpSsoFilterFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(HpSsoFilter());
        registration.addUrlPatterns("/*");
        registration.setOrder(1);
        return registration;
    }
}
