package com.netquest.domain.wifispot.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Embeddable
@Getter
@EqualsAndHashCode
@ToString
@NoArgsConstructor(force = true)
@Entity
@Table(name = "wifi_spot_address")
public class WifiSpotAddress {
    @EmbeddedId
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_address_id"))
    })
    private final WifiSpotAddressId wifiSpotAddressId;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_address_country"))
    })
    private final WifiSpotAddressCountry wifiSpotAddressCountry;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_address_zip_code"))
    })
    private final WifiSpotAddressZipCode wifiSpotAddressZipCode;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_address_line_1"))
    })
    private final WifiSpotAddressLine1 wifiSpotAddressLine1;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_address_line_2"))
    })
    private final WifiSpotAddressLine2 wifiSpotAddressLine2;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_address_city"))
    })
    private final WifiSpotAddressCity wifiSpotAddressCity;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_address_district"))
    })
    private final WifiSpotAddressDistrict wifiSpotAddressDistrict;

    public WifiSpotAddress(WifiSpotAddressCountry wifiSpotAddressCountry, WifiSpotAddressZipCode wifiSpotAddressZipCode, WifiSpotAddressLine1 wifiSpotAddressLine1, WifiSpotAddressLine2 wifiSpotAddressLine2, WifiSpotAddressCity wifiSpotAddressCity, WifiSpotAddressDistrict wifiSpotAddressDistrict) {
        this.wifiSpotAddressId = new WifiSpotAddressId();
        this.wifiSpotAddressCountry = wifiSpotAddressCountry;
        this.wifiSpotAddressZipCode = wifiSpotAddressZipCode;
        this.wifiSpotAddressLine1 = wifiSpotAddressLine1;
        this.wifiSpotAddressLine2 = wifiSpotAddressLine2;
        this.wifiSpotAddressCity = wifiSpotAddressCity;
        this.wifiSpotAddressDistrict = wifiSpotAddressDistrict;
    }
}
