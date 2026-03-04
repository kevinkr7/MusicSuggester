package com.example.myproject;

import com.example.myproject.model.Music;
import com.example.myproject.repository.MusicRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
public class MusicController {

    private final MusicRepository musicRepository;
    public MusicController(MusicRepository musicRepository) {
        this.musicRepository = musicRepository;
    }

    @GetMapping("/songs")
    public List<Music> displayAllSongs(){
        return musicRepository.findAll();
    }

    @PostMapping("/songs")
    public Music addSong(@ModelAttribute Music music,
                         @RequestParam("file") MultipartFile file) {

        try {
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.write(filePath, file.getBytes());

            music.setAudio_url(fileName);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return musicRepository.save(music);
    }


    @GetMapping("/songs/mood/{mood}")
    public List<Music> getSongsByMood(@PathVariable String mood){
        return musicRepository.findByMood(mood);
    }

    @DeleteMapping("/songs/{id}")
    public void deleteSong(@PathVariable int id){
        musicRepository.deleteById(id);
    }

    @Configuration
    public class WebConfig implements WebMvcConfigurer {

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            // Get the absolute path to your uploads folder
            Path uploadDir = Paths.get("uploads");
            String uploadPath = uploadDir.toFile().getAbsolutePath();

            // This maps http://localhost:8080/uploads/song.mp3
            // to the actual file on your computer
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:" + uploadPath + "/");
        }
    }
}
