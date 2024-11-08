package com.netquest.domain.wifispotvisit.model;

import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispotvisit.exception.WifiSpotVisitEndDateTimeBeforeWifiSpotVisitStartDateTimeException;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@Entity
@Table(name = "wifi_spot_visit")
public class WifiSpotVisit {

    @EmbeddedId
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_visit_id"))
    })
    private WifiSpotVisitId wifiSpotVisitId;

    @Embedded
    @NotNull
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_visit_start_datetime"))
    })
    private WifiSpotVisitStartDateTime wifiSpotVisitStartDateTime;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_visit_end_datetime"))
    })
    private WifiSpotVisitEndDateTime wifiSpotVisitEndDateTime;

    @Embedded
    @NotNull
    //@JoinColumn(name = "wifi_spot_id")
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_visit_wifi_spot_id"))
    })
    private WifiSpotId wifiSpotId;

    @Embedded
    @NotNull
    //@JoinColumn(name = "user_id")
    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "wifi_spot_visit_user_id"))
    })
    private UserId userId;

    public WifiSpotVisit(WifiSpotVisitStartDateTime wifiSpotVisitStartDateTime
            ,WifiSpotId wifiSpotId
            ,UserId userId
    ) {
        this.wifiSpotVisitId = new WifiSpotVisitId();
        this.wifiSpotVisitStartDateTime = wifiSpotVisitStartDateTime;
        this.wifiSpotId = wifiSpotId;
        this.userId = userId;
    }

    public WifiSpotVisit(WifiSpotVisitStartDateTime wifiSpotVisitStartDateTime
            ,WifiSpotVisitEndDateTime wifiSpotVisitEndDateTime
            ,WifiSpotId wifiSpotId
            ,UserId userId
    ) {
        if(isEndDateBeforeStartDate(wifiSpotVisitStartDateTime, wifiSpotVisitEndDateTime)) {
            throw new WifiSpotVisitEndDateTimeBeforeWifiSpotVisitStartDateTimeException("End date time cannot be before start date");
        }
        this.wifiSpotVisitId = new WifiSpotVisitId();
        this.wifiSpotVisitStartDateTime = wifiSpotVisitStartDateTime;
        this.wifiSpotVisitEndDateTime = wifiSpotVisitEndDateTime;
        this.wifiSpotId = wifiSpotId;
        this.userId = userId;
    }


    private boolean isEndDateBeforeStartDate(WifiSpotVisitStartDateTime start, WifiSpotVisitEndDateTime end){
        return end.getValue().isBefore(start.getValue());
    }

}
