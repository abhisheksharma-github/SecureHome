package com.securehome.security;

import com.securehome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String normalizedEmail = email == null ? null : email.toLowerCase().trim();
        return new CustomUserDetails(
                userRepository.findByEmail(normalizedEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("No user: " + normalizedEmail)));
    }
}
