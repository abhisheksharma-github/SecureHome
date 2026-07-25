package com.securehome.service;

import com.securehome.dto.AlarmPayload;
import com.securehome.entity.*;
import com.securehome.repository.*;
import com.securehome.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlarmService {

    private final AlarmRepository alarmRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private static final String TOPIC = "/topic/alerts";

    @Transactional
    public AlarmPayload triggerAlarm(String msg) {
        CustomUserDetails p = principal();
        User member = userRepository.findById(p.getId()).orElseThrow(() -> new IllegalStateException("User not found"));
        House house = member.getHouse();
        if (house == null) {
            throw new IllegalStateException("Not assigned to any house. Contact admin.");
        }
        Alarm alarm = Alarm.builder().triggeredBy(member).house(house).status(Alarm.AlarmStatus.ACTIVE).message(msg).build();
        alarmRepository.save(alarm);
        log.warn("ALARM #{} by {} at {}", alarm.getId(), member.getFullName(), house.getHouseNumber());
        AlarmPayload payload = toPayload(alarm);
        messagingTemplate.convertAndSend(TOPIC, payload);
        return payload;
    }

    @Transactional
    public AlarmPayload acknowledgeAlarm(Long id) {
        Alarm alarm = find(id);
        if (alarm.getStatus() == Alarm.AlarmStatus.RESOLVED) {
            throw new IllegalStateException("Already resolved.");
        }
        User admin = userRepository.findById(principal().getId()).orElseThrow();
        alarm.setStatus(Alarm.AlarmStatus.ACKNOWLEDGED);
        alarm.setAcknowledgedAt(OffsetDateTime.now());
        alarm.setAcknowledgedBy(admin);
        alarmRepository.save(alarm);
        AlarmPayload p = toPayload(alarm);
        messagingTemplate.convertAndSend(TOPIC, p);
        return p;
    }

    @Transactional
    public AlarmPayload resolveAlarm(Long id) {
        Alarm alarm = find(id);
        alarm.setStatus(Alarm.AlarmStatus.RESOLVED);
        alarm.setResolvedAt(OffsetDateTime.now());
        alarmRepository.save(alarm);
        AlarmPayload p = toPayload(alarm);
        messagingTemplate.convertAndSend(TOPIC, p);
        return p;
    }

    @Transactional(readOnly = true)
    public List<AlarmPayload> getAllAlarms() {
        return alarmRepository.findAllByOrderByTriggeredAtDesc().stream().map(this::toPayload).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlarmPayload> getActiveAlarms() {
        return alarmRepository.findByStatusOrderByTriggeredAtDesc(Alarm.AlarmStatus.ACTIVE).stream().map(this::toPayload).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlarmPayload> getMyAlarms() {
        return alarmRepository.findByTriggeredByIdOrderByTriggeredAtDesc(principal().getId()).stream().map(this::toPayload).collect(Collectors.toList());
    }

    private CustomUserDetails principal() {
        if (SecurityContextHolder.getContext().getAuthentication() == null
                || !(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof CustomUserDetails details)) {
            throw new IllegalStateException("Authentication required");
        }
        return details;
    }

    private Alarm find(Long id) {
        return alarmRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Alarm not found: " + id));
    }

    private AlarmPayload toPayload(Alarm a) {
        return AlarmPayload.builder().alarmId(a.getId()).userId(a.getTriggeredBy().getId())
                .memberName(a.getTriggeredBy().getFullName()).houseNumber(a.getHouse().getHouseNumber())
                .block(a.getHouse().getBlock()).floor(a.getHouse().getFloor())
                .message(a.getMessage()).status(a.getStatus().name()).triggeredAt(a.getTriggeredAt()).build();
    }
}
