package com.example.myproject;

import com.example.myproject.model.Fav;
import com.example.myproject.repository.FavRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/favorites")
public class FavController {

    private final FavRepository favRepository;

    public FavController(FavRepository favRepository) {
        this.favRepository = favRepository;
    }

    @GetMapping
    public List<Fav> getFavorites(HttpSession session) {
        return favRepository.findByUserId(getUserId(session));
    }

    @PostMapping("/{songId}")
    public Fav addFavorite(@PathVariable long songId, HttpSession session) {
        Long userId = getUserId(session);

        return favRepository.findByUserIdAndSongId(userId, songId)
                .orElseGet(() -> {
                    Fav favorite = new Fav();
                    favorite.setSongId(songId);
                    favorite.setUserId(userId);
                    return favRepository.save(favorite);
                });
    }

    @DeleteMapping("/{songId}")
    public void deleteFavorite(@PathVariable long songId, HttpSession session) {
        Long userId = getUserId(session);
        favRepository.deleteByUserIdAndSongId(userId, songId);
    }

    private Long getUserId(HttpSession session) {
        Object userId = session.getAttribute("userId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required.");
        }

        if (userId instanceof Long id) {
            return id;
        }

        if (userId instanceof Integer id) {
            return id.longValue();
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid session.");
    }
}
