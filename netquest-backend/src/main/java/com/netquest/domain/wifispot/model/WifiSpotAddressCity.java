package com.netquest.domain.wifispot.model;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Embeddable
@Getter
@EqualsAndHashCode
@ToString
@NoArgsConstructor(force = true)
public class WifiSpotAddressCity {
    private final String value;

    public WifiSpotAddressCity(String value) {
        this.value = value;
    }
}
