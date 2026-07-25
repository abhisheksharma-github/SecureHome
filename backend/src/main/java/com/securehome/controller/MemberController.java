package com.securehome.controller;
import com.securehome.dto.*;
import com.securehome.service.AlarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/member") @RequiredArgsConstructor @PreAuthorize("hasRole('MEMBER')")
public class MemberController {
    private final AlarmService alarmService;
    @PostMapping("/alarm")
    public ResponseEntity<?> trigger(@RequestBody(required=false) TriggerAlarmRequest req){
        try{
            AlarmPayload p=alarmService.triggerAlarm(req!=null?req.getMessage():null);
            return ResponseEntity.ok(Map.of("success",true,"message","Emergency alert sent.","alarm",p));
        }catch(IllegalStateException e){ return ResponseEntity.badRequest().body(Map.of("success",false,"error",e.getMessage())); }
    }
    @GetMapping("/alarm/history")
    public ResponseEntity<List<AlarmPayload>> history(){ return ResponseEntity.ok(alarmService.getMyAlarms()); }
}
