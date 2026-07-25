package com.securehome.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;

@Entity @Table(name="cameras") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Camera {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="camera_name",nullable=false,length=100) private String cameraName;
    @Column(name="location",nullable=false,length=200) private String location;
    @Column(name="stream_url",length=500) private String streamUrl;
    @Enumerated(EnumType.STRING) @Column(name="status",nullable=false,length=20) @Builder.Default private CameraStatus status=CameraStatus.ONLINE;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="house_id") private House house;
    @CreationTimestamp @Column(name="installed_at",nullable=false,updatable=false) private OffsetDateTime installedAt;
    @Column(name="last_ping",nullable=false) @Builder.Default private OffsetDateTime lastPing=OffsetDateTime.now();
    public enum CameraStatus { ONLINE, OFFLINE, MAINTENANCE }
}
