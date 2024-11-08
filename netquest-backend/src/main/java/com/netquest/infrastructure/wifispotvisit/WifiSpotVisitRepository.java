package com.netquest.infrastructure.wifispotvisit;

import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisit;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WifiSpotVisitRepository extends JpaRepository<WifiSpotVisit, WifiSpotVisitId> {
    List<WifiSpotVisit> findByWifiSpotId(WifiSpotId wifiSpotId);
    List<WifiSpotVisit> findByUserId(UserId userId);
    List<WifiSpotVisit> findByWifiSpotIdAndUserId(WifiSpotId wifiSpotId, UserId userId);
}
