package com.netquest.infrastructure.wifispot;

import com.netquest.domain.user.model.User;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpot;
import com.netquest.domain.wifispot.model.WifiSpotId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WifiSpotRepository extends JpaRepository<WifiSpot, WifiSpotId> {
    @Query("SELECT COUNT(wfs) FROM WifiSpot wfs")
    int getNumberOfWifiSpots();

    WifiSpot getWifiSpotByWifiSpotId(WifiSpotId wifiSpotId);
}
