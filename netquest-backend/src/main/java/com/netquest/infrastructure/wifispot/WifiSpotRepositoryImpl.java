package com.netquest.infrastructure.wifispot;

import com.netquest.domain.wifispot.model.WifiSpot;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class WifiSpotRepositoryImpl implements WifiSpotRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<WifiSpot> findFilteredWifiSpots(
        String name, Boolean exactName, String description, Boolean exactDescription,
        String locationType, String wifiQuality, String signalStrength,
        String bandwidth, Boolean crowded, Boolean coveredArea,
        Boolean airConditioning, Boolean goodView, String noiseLevel,
        Boolean petFriendly, Boolean childFriendly, Boolean disableAccess,
        Boolean availablePowerOutlets, Boolean chargingStations,
        Boolean restroomsAvailable, Boolean parkingAvailability,
        Boolean foodOptions, Boolean drinkOptions, Boolean openDuringRain,
        Boolean openDuringHeat, Boolean heatedInWinter,
        Boolean shadedAreas, Boolean outdoorFans
    ) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<WifiSpot> query = cb.createQuery(WifiSpot.class);
        Root<WifiSpot> root = query.from(WifiSpot.class);

        List<Predicate> predicates = new ArrayList<>();

        // Example: Add predicates dynamically based on non-null parameters
        if (name != null) {
            if (exactName != null && exactName) {
                predicates.add(cb.equal(root.get("name"), name));
            } else {
                predicates.add(cb.like(root.get("name"), "%" + name + "%"));
            }
        }

        if (description != null) {
            if (exactDescription != null && exactDescription) {
                predicates.add(cb.equal(root.get("description"), description));
            } else {
                predicates.add(cb.like(root.get("description"), "%" + description + "%"));
            }
        }

        if (locationType != null) {
            predicates.add(cb.equal(root.get("locationType"), locationType));
        }

        if (wifiQuality != null) {
            predicates.add(cb.equal(root.get("wifiQuality"), wifiQuality));
        }

        // Add predicates for other fields
        // Example for Boolean fields:
        if (crowded != null) {
            predicates.add(cb.equal(root.get("crowded"), crowded));
        }
        if (coveredArea != null) {
            predicates.add(cb.equal(root.get("coveredArea"), coveredArea));
        }

        // Combine predicates and build the query
        query.where(cb.and(predicates.toArray(new Predicate[0])));
        return entityManager.createQuery(query).getResultList();
    }
}
