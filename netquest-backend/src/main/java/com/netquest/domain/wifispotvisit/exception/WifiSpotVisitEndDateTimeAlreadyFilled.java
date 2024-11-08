package com.netquest.domain.wifispotvisit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class WifiSpotVisitEndDateTimeAlreadyFilled extends RuntimeException{
    public WifiSpotVisitEndDateTimeAlreadyFilled(String message){ super(message); }
}
