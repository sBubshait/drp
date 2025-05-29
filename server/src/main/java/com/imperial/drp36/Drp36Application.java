package com.imperial.drp36;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication(scanBasePackages={"com.imperial.drp36", "com.imperial.drp36.entity", "com.imperial.drp36.services", "com.imperial.drp36.repository"})
public class Drp36Application {

  public static void main(String[] args) {
    SpringApplication.run(Drp36Application.class, args);
  }
}
