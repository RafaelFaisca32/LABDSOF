package com.netquest.controller;

import com.netquest.domain.BookService;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.service.WifiSpotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/public")
public class PublicController {

    private final UserService userService;
    private final BookService bookService;
    private final WifiSpotService wifiSpotService;

    @GetMapping("/numberOfUsers")
    public Integer getNumberOfUsers() {
        return userService.getUsers().size();
    }

    @GetMapping("/numberOfBooks")
    public Integer getNumberOfBooks() {
        return bookService.getBooks().size();
    }

    @GetMapping("/number-wifi-spots")
    public int getNumberOfWifiSpots() {
        return wifiSpotService.getNumberOfWifiSpots();
    }
}
