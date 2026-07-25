package com.securehome.security;
import com.securehome.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.*;
@Getter
public class CustomUserDetails implements UserDetails {
    private final Long id;
    private final String email,passwordHash,fullName;
    private final User.Role role;
    private final Long houseId;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;
    public CustomUserDetails(User u){
        this.id=u.getId(); this.email=u.getEmail(); this.passwordHash=u.getPasswordHash();
        this.fullName=u.getFullName(); this.role=u.getRole();
        this.houseId=(u.getHouse()!=null)?u.getHouse().getId():null;
        this.active=Boolean.TRUE.equals(u.getIsActive());
        this.authorities=List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole().name()));
    }
    @Override public String getUsername(){return email;}
    @Override public String getPassword(){return passwordHash;}
    @Override public boolean isAccountNonExpired(){return true;}
    @Override public boolean isAccountNonLocked(){return true;}
    @Override public boolean isCredentialsNonExpired(){return true;}
    @Override public boolean isEnabled(){return active;}
}
