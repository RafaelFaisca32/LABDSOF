package com.netquest.infrastructure.wifispot;

import com.netquest.domain.user.model.User;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.wifispot.model.WifiSpot;
import com.netquest.domain.wifispot.model.WifiSpotId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WifiSpotRepository extends JpaRepository<WifiSpot, WifiSpotId> {
    @Query("SELECT COUNT(wfs) FROM WifiSpot wfs")
    int getNumberOfWifiSpots();

    WifiSpot getWifiSpotByWifiSpotId(WifiSpotId wifiSpotId);

    @Query("SELECT w FROM WifiSpot w " +
        "WHERE (:name IS NULL OR " +
        "       (:exactName = TRUE AND w.name = :name) OR " +
        "       (:exactName = FALSE AND LOWER(w.name) LIKE CONCAT('%', LOWER(:name), '%'))) " +
        "AND (:description IS NULL OR " +
        "     (:exactDescription = TRUE AND w.description = :description) OR " +
        "     (:exactDescription = FALSE AND LOWER(w.description) LIKE CONCAT('%', LOWER(:description), '%'))) " +
        "AND (:locationType IS NULL OR w.locationType = :locationType) " +
        "AND (:wifiQuality IS NULL OR w.wifiQuality = :wifiQuality) " +
        "AND (:signalStrength IS NULL OR w.signalStrength = :signalStrength) " +
        "AND (:bandwidth IS NULL OR w.bandwidth = :bandwidth) " +
        "AND (:crowded IS NULL OR w.crowded = :crowded) " +
        "AND (:coveredArea IS NULL OR w.coveredArea = :coveredArea) " +
        "AND (:airConditioning IS NULL OR w.airConditioning = :airConditioning) " +
        "AND (:goodView IS NULL OR w.goodView = :goodView) " +
        "AND (:noiseLevel IS NULL OR w.noiseLevel = :noiseLevel) " +
        "AND (:petFriendly IS NULL OR w.petFriendly = :petFriendly) " +
        "AND (:childFriendly IS NULL OR w.childFriendly = :childFriendly) " +
        "AND (:disableAccess IS NULL OR w.disableAccess = :disableAccess) " +
        "AND (:availablePowerOutlets IS NULL OR w.availablePowerOutlets = :availablePowerOutlets) " +
        "AND (:chargingStations IS NULL OR w.chargingStations = :chargingStations) " +
        "AND (:restroomsAvailable IS NULL OR w.restroomsAvailable = :restroomsAvailable) " +
        "AND (:parkingAvailability IS NULL OR w.parkingAvailability = :parkingAvailability) " +
        "AND (:foodOptions IS NULL OR w.foodOptions = :foodOptions) " +
        "AND (:drinkOptions IS NULL OR w.drinkOptions = :drinkOptions) " +
        "AND (:openDuringRain IS NULL OR w.openDuringRain = :openDuringRain) " +
        "AND (:openDuringHeat IS NULL OR w.openDuringHeat = :openDuringHeat) " +
        "AND (:heatedInWinter IS NULL OR w.heatedInWinter = :heatedInWinter) " +
        "AND (:shadedAreas IS NULL OR w.shadedAreas = :shadedAreas) " +
        "AND (:outdoorFans IS NULL OR w.outdoorFans = :outdoorFans)")
    List<WifiSpot> findWifiSpots(
        @Param("name") String name,
        @Param("exactName") Boolean exactName,
        @Param("description") String description,
        @Param("exactDescription") Boolean exactDescription,
        @Param("locationType") String locationType,
        @Param("wifiQuality") String wifiQuality,
        @Param("signalStrength") String signalStrength,
        @Param("bandwidth") String bandwidth,
        @Param("crowded") Boolean crowded,
        @Param("coveredArea") Boolean coveredArea,
        @Param("airConditioning") Boolean airConditioning,
        @Param("goodView") Boolean goodView,
        @Param("noiseLevel") String noiseLevel,
        @Param("petFriendly") Boolean petFriendly,
        @Param("childFriendly") Boolean childFriendly,
        @Param("disableAccess") Boolean disableAccess,
        @Param("availablePowerOutlets") Boolean availablePowerOutlets,
        @Param("chargingStations") Boolean chargingStations,
        @Param("restroomsAvailable") Boolean restroomsAvailable,
        @Param("parkingAvailability") Boolean parkingAvailability,
        @Param("foodOptions") Boolean foodOptions,
        @Param("drinkOptions") Boolean drinkOptions,
        @Param("openDuringRain") Boolean openDuringRain,
        @Param("openDuringHeat") Boolean openDuringHeat,
        @Param("heatedInWinter") Boolean heatedInWinter,
        @Param("shadedAreas") Boolean shadedAreas,
        @Param("outdoorFans") Boolean outdoorFans
    );

}
