package com.netquest.domain.wifispotvisit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class EmptyWifiSpotVisitEndDateTimeException extends RuntimeException {
    public EmptyWifiSpotVisitEndDateTimeException(String message) {super(message);}
}
