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

    @Query("SELECT wfs FROM WifiSpot wfs " +
        "WHERE (:name IS NULL OR " +
        "       (:exactName = TRUE AND wfs.name = :name) OR " +
        "       (:exactName = FALSE AND wfs.name LIKE %:name%)) " +
        "AND (:description IS NULL OR " +
        "     (:exactDescription = TRUE AND wfs.description = :description) OR " +
        "     (:exactDescription = FALSE AND wfs.description LIKE %:description%)) " +
        "AND (:locationType IS NULL OR wfs.locationType = :locationType) " +
        "AND (:wifiQuality IS NULL OR wfs.wifiQuality = :wifiQuality) " +
        "AND (:signalStrength IS NULL OR wfs.signalStrength = :signalStrength) " +
        "AND (:bandwidth IS NULL OR wfs.bandwidth = :bandwidth) " +
        "AND (:crowded IS NULL OR wfs.crowded = :crowded) " +
        "AND (:coveredArea IS NULL OR wfs.coveredArea = :coveredArea) " +
        "AND (:airConditioning IS NULL OR wfs.airConditioning = :airConditioning) " +
        "AND (:goodView IS NULL OR wfs.goodView = :goodView) " +
        "AND (:noiseLevel IS NULL OR wfs.noiseLevel = :noiseLevel) " +
        "AND (:petFriendly IS NULL OR wfs.petFriendly = :petFriendly) " +
        "AND (:childFriendly IS NULL OR wfs.childFriendly = :childFriendly) " +
        "AND (:disableAccess IS NULL OR wfs.disableAccess = :disableAccess) " +
        "AND (:availablePowerOutlets IS NULL OR wfs.availablePowerOutlets = :availablePowerOutlets) " +
        "AND (:chargingStations IS NULL OR wfs.chargingStations = :chargingStations) " +
        "AND (:restroomsAvailable IS NULL OR wfs.restroomsAvailable = :restroomsAvailable) " +
        "AND (:parkingAvailability IS NULL OR wfs.parkingAvailability = :parkingAvailability) " +
        "AND (:foodOptions IS NULL OR wfs.foodOptions = :foodOptions) " +
        "AND (:drinkOptions IS NULL OR wfs.drinkOptions = :drinkOptions) " +
        "AND (:openDuringRain IS NULL OR wfs.openDuringRain = :openDuringRain) " +
        "AND (:openDuringHeat IS NULL OR wfs.openDuringHeat = :openDuringHeat) " +
        "AND (:heatedInWinter IS NULL OR wfs.heatedInWinter = :heatedInWinter) " +
        "AND (:shadedAreas IS NULL OR wfs.shadedAreas = :shadedAreas) " +
        "AND (:outdoorFans IS NULL OR wfs.outdoorFans = :outdoorFans)")
    List<WifiSpot> findFilteredWifiSpots(
        @Param("name") String name, @Param("exactName") Boolean exactName,
        @Param("description") String description, @Param("exactDescription") Boolean exactDescription,
        @Param("locationType") String locationType, @Param("wifiQuality") String wifiQuality,
        @Param("signalStrength") String signalStrength, @Param("bandwidth") String bandwidth,
        @Param("crowded") Boolean crowded, @Param("coveredArea") Boolean coveredArea,
        @Param("airConditioning") Boolean airConditioning, @Param("goodView") Boolean goodView,
        @Param("noiseLevel") String noiseLevel, @Param("petFriendly") Boolean petFriendly,
        @Param("childFriendly") Boolean childFriendly, @Param("disableAccess") Boolean disableAccess,
        @Param("availablePowerOutlets") Boolean availablePowerOutlets,
        @Param("chargingStations") Boolean chargingStations,
        @Param("restroomsAvailable") Boolean restroomsAvailable,
        @Param("parkingAvailability") Boolean parkingAvailability,
        @Param("foodOptions") Boolean foodOptions, @Param("drinkOptions") Boolean drinkOptions,
        @Param("openDuringRain") Boolean openDuringRain, @Param("openDuringHeat") Boolean openDuringHeat,
        @Param("heatedInWinter") Boolean heatedInWinter, @Param("shadedAreas") Boolean shadedAreas,
        @Param("outdoorFans") Boolean outdoorFans
    );

}
