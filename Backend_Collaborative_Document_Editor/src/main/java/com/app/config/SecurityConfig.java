package com.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer{
	 @Bean
	    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http.csrf(csrf -> csrf.disable())
              .authorizeHttpRequests(requests -> requests
             		 .requestMatchers("/ws/**").permitAll()
                      .requestMatchers("/api/**").permitAll()
                      .anyRequest().authenticated())
              .formLogin(login -> login.disable())
              .httpBasic(basic -> basic.disable());
	        return http.build();
}

}
