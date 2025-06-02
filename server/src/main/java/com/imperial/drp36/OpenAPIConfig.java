package com.imperial.drp36;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(new Info()
            .title("Feed API")
            .summary("REST API for getting feed content")
            .description("Please note: the domains `drp-api.saleh.host` and `drp-web.saleh.host` are now deprecated. " +
                "The API is now hosted at `api.saleh.host` and the web app at `web.saleh.host`. " +
                "Please update your configurations accordingly. " +
                "This API provides endpoints to retrieve, create, and manage feed items, including articles, polls, and questions.")
            .version("1.0.0")
            .contact(new Contact()
                .name("Imperial DRP36 Team")
                .email("saleh.bubshait23@imperial.ac.uk"))
            .license(new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT")))
        .servers(List.of(
            new Server().url("https://drp-api.saleh.host").description("Production Server"),
    new Server().url("http://localhost:8080").description("Development Server")
        )).tags(List.of(
            new Tag().name("Status").description("API status and health check endpoints"),
            new Tag().name("Feed").description("Feed content and poll management endpoints")
        ));
  }
}