package com.securehome.repository;

import com.securehome.entity.House;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HouseRepository extends JpaRepository<House, Long> {

    Optional<House> findByHouseNumber(String houseNumber);

    boolean existsByHouseNumber(String houseNumber);

    @Query("""
SELECT h.id,
       h.houseNumber,
       h.block,
       h.floor,
       h.description,
       COUNT(u)
FROM House h
LEFT JOIN h.residents u
GROUP BY h.id,h.houseNumber,h.block,h.floor,h.description
""")
    List<Object[]> getHouseSummary();

}
