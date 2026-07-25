package com.securehome.controller;

import com.securehome.dto.*;
import com.securehome.entity.*;
import com.securehome.repository.*;
import com.securehome.service.AlarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AlarmService alarmService;
    private final UserRepository userRepository;
    private final HouseRepository houseRepository;
    private final CameraRepository cameraRepository;

    @GetMapping("/alarms")
    public ResponseEntity<List<AlarmPayload>> all() {
        return ResponseEntity.ok(alarmService.getAllAlarms());
    }

    @GetMapping("/alarms/active")
    public ResponseEntity<List<AlarmPayload>> active() {
        return ResponseEntity.ok(alarmService.getActiveAlarms());
    }

    @PatchMapping("/alarms/{id}/acknowledge")
    public ResponseEntity<?> ack(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(alarmService.acknowledgeAlarm(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/alarms/{id}/resolve")
    public ResponseEntity<?> resolve(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(alarmService.resolveAlarm(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/members")
    public ResponseEntity<List<UserDto>> members() {

        List<UserDto> members = userRepository.findByRole(User.Role.MEMBER)
                .stream()
                .map(this::dto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(members);
    }

    @PatchMapping("/members/{id}/deactivate")
    public ResponseEntity<?> deactivate(@PathVariable Long id) {
        return toggle(id, false);
    }

    @PatchMapping("/members/{id}/activate")
    public ResponseEntity<?> activate(@PathVariable Long id) {
        return toggle(id, true);
    }

    private ResponseEntity<?> toggle(Long id, boolean active) {
        return userRepository.findById(id).map(u -> {
            u.setIsActive(active);
            userRepository.save(u);
            return ResponseEntity.ok(Map.of("message", active ? "Activated" : "Deactivated", "userId", id));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cameras")
    public ResponseEntity<List<Camera>> cameras() {
        return ResponseEntity.ok(cameraRepository.findAll());
    }

    @PatchMapping("/cameras/{id}/status")
    public ResponseEntity<?> camStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String s = body.get("status");
        if (s == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "status required"));
        }
        try {
            Camera.CameraStatus ns = Camera.CameraStatus.valueOf(s.toUpperCase());
            return cameraRepository.findById(id).map(c -> {
                c.setStatus(ns);
                cameraRepository.save(c);
                return ResponseEntity.ok(c);
            }).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
    }

    @GetMapping("/houses")
    public ResponseEntity<?> houses() {

        List<Map<String, Object>> result = new ArrayList<>();

        Object summaries;
        try {
            summaries = houseRepository.getClass().getMethod("getHouseSummary").invoke(houseRepository);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
        if (summaries instanceof Iterable<?>) {
            for (Object rowObj : (Iterable<?>) summaries) {
                Object[] row = (Object[]) rowObj;

                Map<String, Object> m = new HashMap<>();

                m.put("id", row[0]);
                m.put("houseNumber", row[1]);
                m.put("block", row[2]);
                m.put("floor", row[3]);
                m.put("description", row[4]);
                m.put("residentCount", row[5]);

                result.add(m);
            }
        }

        return ResponseEntity.ok(result);
    }

    private UserDto dto(User u) {
        return UserDto.builder().id(u.getId()).fullName(u.getFullName()).email(u.getEmail()).phone(u.getPhone())
                .role(u.getRole().name()).isActive(u.getIsActive())
                .houseId(u.getHouse() != null ? u.getHouse().getId() : null)
                .houseNumber(u.getHouse() != null ? u.getHouse().getHouseNumber() : null)
                .createdAt(u.getCreatedAt()).build();
    }
}
