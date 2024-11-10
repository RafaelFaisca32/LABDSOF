package com.netquest.infrastructure.wifispotvisit;

import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpotId;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisit;
import com.netquest.domain.wifispotvisit.model.WifiSpotVisitId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WifiSpotVisitRepository extends JpaRepository<WifiSpotVisit, WifiSpotVisitId> {
    List<WifiSpotVisit> findByWifiSpotId(WifiSpotId wifiSpotId);
    List<WifiSpotVisit> findByUserId(UserId userId);
    List<WifiSpotVisit> findByWifiSpotIdAndUserId(WifiSpotId wifiSpotId, UserId userId);
    Optional<WifiSpotVisit> findByWifiSpotVisitIdAndUserId(WifiSpotVisitId wifiSpotVisitId, UserId userId);

    @Query("SELECT CASE WHEN COUNT(wsv) > 0 THEN TRUE ELSE FALSE END FROM WifiSpotVisit wsv " +
            "WHERE wsv.userId = :userId AND (" +
            "   (wsv.wifiSpotVisitStartDateTime.value < :startDateTime AND " +
            "   (wsv.wifiSpotVisitEndDateTime IS NULL OR :startDateTime < wsv.wifiSpotVisitEndDateTime.value)) " +
            "   OR " +
            "   (wsv.wifiSpotVisitStartDateTime.value < :endDateTime AND " +
            "   (wsv.wifiSpotVisitEndDateTime IS NULL OR :endDateTime < wsv.wifiSpotVisitEndDateTime.value)) " +
            "   OR " +
            "   (:startDateTime < wsv.wifiSpotVisitStartDateTime.value AND " +
            "   (wsv.wifiSpotVisitEndDateTime IS NULL OR wsv.wifiSpotVisitEndDateTime.value < :endDateTime))" +
            ")")
    boolean existsWifiSpotVisitConflictingIntervalByUserId(
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            @Param("userId") UserId userId);



    @Query("SELECT CASE WHEN COUNT(wsv) > 0 THEN TRUE ELSE FALSE END from WifiSpotVisit wsv where wsv.wifiSpotVisitEndDateTime IS NULL and wsv.userId = :userId")
    boolean existsOnGoingWifiSpotVisitByUserId(@Param("userId") UserId userId);

    @Query("SELECT wsv from WifiSpotVisit wsv where wsv.wifiSpotVisitEndDateTime IS NULL and wsv.userId = :userId")
    Optional<WifiSpotVisit> findOngoingWifiSpotVisitByUserId(@Param("userId") UserId userId);

    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END FROM wifi_spot_visit wsv " +
            "WHERE wsv.user_id = :userId AND " +
            "wsv.wifi_spot_id = :wifiSpotId AND " +
            "(wsv.wifi_spot_visit_end_date_time IS NULL OR " +
            "DATE_ADD(wsv.wifi_spot_visit_end_date_time, INTERVAL 10 MINUTE) >= :start)",
            nativeQuery = true)
    boolean existsWifiSpotVisitInSameWifiSpotInLast10MinutesByUserId(UserId userId, WifiSpotId wifiSpotId, LocalDateTime start);
}
