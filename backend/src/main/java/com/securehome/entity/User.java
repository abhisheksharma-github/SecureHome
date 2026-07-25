package com.securehome.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.OffsetDateTime;
import java.util.List;

@Entity @Table(name="users") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="full_name",nullable=false,length=100) private String fullName;
    @Column(name="email",nullable=false,unique=true,length=150) private String email;
    @Column(name="password_hash",nullable=false,length=255) private String passwordHash;
    @Column(name="phone",length=20) private String phone;
    @Enumerated(EnumType.STRING) @Column(name="role",nullable=false,length=20) private Role role;
    @Column(name="is_active",nullable=false) @Builder.Default private Boolean isActive=true;
    @CreationTimestamp @Column(name="created_at",nullable=false,updatable=false) private OffsetDateTime createdAt;
    @UpdateTimestamp @Column(name="updated_at",nullable=false) private OffsetDateTime updatedAt;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="house_id") private House house;
    @ToString.Exclude @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy="triggeredBy",fetch=FetchType.LAZY,cascade=CascadeType.ALL) private List<Alarm> triggeredAlarms;
    public enum Role { ADMIN, MEMBER }
}
