package com.example.myproject.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Fav {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;
    private long song_id;

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public long getSong_id() {
        return song_id;
    }
    public void setSong_id(long song_id) {
        this.song_id = song_id;
    }
}
