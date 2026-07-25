package com.securehome.repository;
import com.securehome.entity.Camera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository


public interface CameraRepository extends JpaRepository<Camera,Long> {
    List<Camera> findByStatus(Camera.CameraStatus status);
    long countByStatus(Camera.CameraStatus status);
}
