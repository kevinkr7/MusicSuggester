package com.example.myproject.repository;

import com.example.myproject.model.Music;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MusicRepository extends JpaRepository<Music,Integer> {
    List<Music> findByMoodAndUserId(String mood, Long userId);
    List<Music> findByUserId(Long userId);
}
