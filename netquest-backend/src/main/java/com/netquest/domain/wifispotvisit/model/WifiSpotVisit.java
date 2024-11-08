package com.netquest.domain.wifispotvisit.model;

import com.netquest.domain.user.model.User;
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


    public WifiSpotVisit(
            @NonNull WifiSpotVisitStartDateTime wifiSpotVisitStartDateTime
            ,WifiSpotVisitEndDateTime wifiSpotVisitEndDateTime
            ,@NonNull WifiSpotId wifiSpotId
            ,@NonNull UserId userId
    ) {
        if(wifiSpotVisitEndDateTime != null && isEndDateBeforeStartDate(wifiSpotVisitStartDateTime, wifiSpotVisitEndDateTime)) {
            throw new WifiSpotVisitEndDateTimeBeforeWifiSpotVisitStartDateTimeException("End date time cannot be before start date");
        }
        this.wifiSpotVisitId = new WifiSpotVisitId();
        this.wifiSpotVisitStartDateTime = new WifiSpotVisitStartDateTime(wifiSpotVisitStartDateTime.getValue());
        this.wifiSpotVisitEndDateTime = wifiSpotVisitEndDateTime != null ? new WifiSpotVisitEndDateTime(wifiSpotVisitEndDateTime.getValue()) : null;
        this.wifiSpotId = new WifiSpotId(wifiSpotId.getValue());
        this.userId = new UserId(userId.getValue());
    }


    private boolean isEndDateBeforeStartDate(WifiSpotVisitStartDateTime start, WifiSpotVisitEndDateTime end){
        return end.getValue().isBefore(start.getValue());
    }

    public WifiSpotVisit updateEndDateTime(WifiSpotVisitEndDateTime endDateTime){
        this.wifiSpotVisitEndDateTime = new WifiSpotVisitEndDateTime(endDateTime.getValue());
        return this;
    }

}
