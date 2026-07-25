package com.securehome.repository;

import com.securehome.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    List<User> findByHouseId(Long houseId);
    @Query("""
SELECT u
FROM User u
LEFT JOIN FETCH u.house
WHERE u.role = :role
""")
List<User> findByRole(@Param("role") User.Role role);
}
