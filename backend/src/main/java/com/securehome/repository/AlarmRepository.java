package com.securehome.repository;
import com.securehome.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AlarmRepository extends JpaRepository<Alarm,Long> {
    List<Alarm> findByStatusOrderByTriggeredAtDesc(Alarm.AlarmStatus status);
    List<Alarm> findByTriggeredByIdOrderByTriggeredAtDesc(Long userId);
    List<Alarm> findAllByOrderByTriggeredAtDesc();
}
