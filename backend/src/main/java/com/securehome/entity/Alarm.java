package com.securehome.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;

@Entity @Table(name="alarms") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Alarm {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="triggered_by",nullable=false) private User triggeredBy;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="house_id",nullable=false) private House house;
    @Enumerated(EnumType.STRING) @Column(name="status",nullable=false,length=20) @Builder.Default private AlarmStatus status=AlarmStatus.ACTIVE;
    @Column(name="message",columnDefinition="TEXT") private String message;
    @CreationTimestamp @Column(name="triggered_at",nullable=false,updatable=false) private OffsetDateTime triggeredAt;
    @Column(name="acknowledged_at") private OffsetDateTime acknowledgedAt;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="acknowledged_by") private User acknowledgedBy;
    @Column(name="resolved_at") private OffsetDateTime resolvedAt;
    public enum AlarmStatus { ACTIVE, ACKNOWLEDGED, RESOLVED }
}
