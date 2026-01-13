package com.example.project1.Repository;

import com.example.project1.Models.Tables;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TablesRepository extends JpaRepository<Tables, Integer> {
    Optional<Tables> findByTableName(String tableName);
}
