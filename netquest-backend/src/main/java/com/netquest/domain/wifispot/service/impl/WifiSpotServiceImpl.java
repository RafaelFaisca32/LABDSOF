package com.netquest.domain.wifispot.service.impl;


import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionCreateByWifiSpotCreationDto;
import com.netquest.domain.pointsearntransaction.service.PointsEarnTransactionService;
import com.netquest.domain.shared.*;
import com.netquest.domain.user.dto.UserDto;
import com.netquest.domain.user.model.User;
import com.netquest.domain.user.model.Username;
import com.netquest.domain.user.exception.UserNotFoundException;
import com.netquest.domain.user.service.UserService;
import com.netquest.domain.wifispot.dto.WifiSpotCreateDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.dto.WifiSpotFilterDto;
import com.netquest.domain.wifispot.exception.WifiSpotNotFoundException;
import com.netquest.domain.wifispot.mapper.WifiSpotMapper;
import com.netquest.domain.wifispot.model.*;
import com.netquest.domain.wifispot.service.WifiSpotService;
import com.netquest.infrastructure.user.UserRepository;
import com.netquest.infrastructure.wifispot.WifiSpotRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.AccessDeniedException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class WifiSpotServiceImpl implements WifiSpotService {
    private final WifiSpotRepository wifiSpotRepository;
    private final UserRepository userRepository;
    private final WifiSpotMapper wifiSpotMapper;
    private final UserService userService;
    private final PointsEarnTransactionService pointsEarnTransactionService;
    @Value("${netquestaiurl}")
    private String aiUrl;
    @Value("${spring.datasource.url}")
    private String dbUrl;
    @Value("${spring.datasource.username}")
    private String dbUser;
    @Value("${spring.datasource.password}")
    private String dbPassword;



    @Override
    public List<WifiSpotDto> getWifiSpots() {
        List<WifiSpot> wifiSpotList = wifiSpotRepository.findAll();
        return wifiSpotList.stream().map(wifiSpotMapper::wifiSpotDomainToDto).toList();
    }

    @Override
    public List<WifiSpotDto> getWifiSpotsIA(String message) {
        String aiResponse = "";
        try {
            // Endpoint URL
            URL url = new URL(aiUrl);

            // Create connection
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            // JSON payload
            String jsonInputString = String.format("{\"user_query\": \"%s\"}", message);

            // Write the request body
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // Read the response
            try (Scanner scanner = new Scanner(conn.getInputStream(), StandardCharsets.UTF_8.name())) {
                String response = scanner.useDelimiter("\\A").next();
                aiResponse = response.replaceAll("\\\\", ""); // Remove backslashes
                aiResponse = aiResponse.replaceAll("\n", ""); // Replace escaped newlines with spaces
                aiResponse = aiResponse.replaceAll("^.*\"sql_query\":\"", ""); // Remove prefix up to the query
                aiResponse = aiResponse.replaceAll("\"}$", ""); // Remove trailing characters
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        List<String> wifiSpotNames = new ArrayList<>();
        if(aiResponse.startsWith("SELECT ws.wifi_spot_name")){
            wifiSpotNames = executeQuery(aiResponse);
        }else if(aiResponse.startsWith("SELECT COUNT")) {
            return new ArrayList<>();
        }else{
            throw new IllegalArgumentException(aiResponse);
        }


        List<WifiSpotName> wifiSpotNamesValue = wifiSpotNames
                .stream()
                .map(id -> new WifiSpotName(id))
                .collect(Collectors.toList());


        return wifiSpotRepository.findByWifiSpotNameIn(wifiSpotNamesValue).stream().map(wifiSpotMapper::wifiSpotDomainToDto).toList();
    }

    private List<String> executeQuery(String sqlQuery) {
        List<String> wifiSpotIds = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sqlQuery);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                wifiSpotIds.add(resultSet.getString("wifi_spot_name"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return wifiSpotIds;
    }

    @Override
    public WifiSpotDto createWifiSpot(WifiSpotCreateDto wifiSpotDto, UUID userUUID) {



        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }


        WifiSpot wifiSpot = wifiSpotMapper.wifiSpotCreateDtoToDomain(wifiSpotDto,userUUID);
        WifiSpotDto wifiSpotDtoNew = wifiSpotMapper.wifiSpotDomainToDto(wifiSpotRepository.save(wifiSpot));

        createPointsEarnTransactionBasedOnWifiSpotCreation(wifiSpotDtoNew);

        return wifiSpotDtoNew;
    }

    @Override
    public int getNumberOfWifiSpots() {
        return wifiSpotRepository.getNumberOfWifiSpots();
    }

    @Override
    public boolean existsById(UUID uuid) {
        WifiSpotId wifiSpotId = new WifiSpotId(uuid);
        return wifiSpotRepository.existsById(wifiSpotId);
    }

    @Override
    public WifiSpotDto getWifiSpotById(UUID uuid) {
        WifiSpotId wifiSpotId = new WifiSpotId(uuid);
        WifiSpot wifiSpotDto = wifiSpotRepository.findById(wifiSpotId).orElseThrow(() -> new WifiSpotNotFoundException("WifiSpot not found"));
        return wifiSpotMapper.wifiSpotDomainToDto(wifiSpotDto);
    }

    @Override
    public List<WifiSpotDto> getFilteredWifiSpots(
        String name, Boolean exactName,
        String description, Boolean exactDescription,
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



        String nameFilter = null;
        if (name != null) {
            nameFilter = (exactName != null && exactName) ? escapeForLike(name) : ("%" + escapeForLike(name) + "%");
        }
        String descFilter = null;
        if (description != null) {
            descFilter = (exactDescription != null && exactDescription) ? escapeForLike(description) : ("%" + escapeForLike(description) + "%");
        }





        List<WifiSpot> l =  wifiSpotRepository.findFilteredWifiSpots(
            nameFilter, descFilter,
            LocationType.valueOf(locationType),QualityType.valueOf(wifiQuality), StrengthType.valueOf(signalStrength),
            BandwithType.valueOf(bandwidth), crowded, coveredArea, airConditioning,
            goodView, NoiseType.valueOf(noiseLevel), petFriendly, childFriendly,
            disableAccess, availablePowerOutlets, chargingStations,
            restroomsAvailable, parkingAvailability, foodOptions,
            drinkOptions, openDuringRain, openDuringHeat,
            heatedInWinter, shadedAreas, outdoorFans
        );
        return l.stream().map(wifiSpotMapper::wifiSpotDomainToDto).toList();
    }

    @Override
    public List<WifiSpotDto> getWifiSpotsWithFilters(WifiSpotFilterDto wifiSpotFilterDto) {

        String name = null;
        String description = null;
        boolean exactName = false;
        boolean exactDescription = false;
        LocationType locationType = null;
        QualityType wifiQuality = null;
        StrengthType signalStrength = null;
        BandwithType bandwidth = null;
        Boolean crowded = null;
        Boolean coveredArea = null;
        Boolean airConditioning = null;
        Boolean goodView = null;
        NoiseType noiseLevel = null;
        Boolean petFriendly = null;
        Boolean childFriendly = null;
        Boolean disableAccess = null;
        Boolean availablePowerOutlets = null;
        Boolean chargingStations = null;
        Boolean restroomsAvailable = null;
        Boolean parkingAvailability = null;
        Boolean foodOptions = null;
        Boolean drinkOptions = null;
        Boolean openDuringRain = null;
        Boolean openDuringHeat  = null;
        Boolean heatedInWinter = null;
        Boolean shadedAreas  = null;
        Boolean outdoorFans  = null;

        if(wifiSpotFilterDto != null) {
            exactName = wifiSpotFilterDto.getExactName() != null && wifiSpotFilterDto.getExactName();
            exactDescription = wifiSpotFilterDto.getExactDescription() != null && wifiSpotFilterDto.getExactDescription();

            if(wifiSpotFilterDto.getName() != null) {
                if(!exactName) {
                    name = "%" + escapeForLike(wifiSpotFilterDto.getName()) + "%";
                } else {
                    name = escapeForLike(wifiSpotFilterDto.getName());
                }
            }

            if(wifiSpotFilterDto.getDescription() != null) {
                if(!exactDescription) {
                    description = "%" + escapeForLike(wifiSpotFilterDto.getDescription()) + "%";
                } else {
                    description = escapeForLike(wifiSpotFilterDto.getDescription());
                }
            }

            locationType = wifiSpotFilterDto.getLocationType();
            wifiQuality = wifiSpotFilterDto.getWifiQuality();
            signalStrength = wifiSpotFilterDto.getSignalStrength();
            bandwidth = wifiSpotFilterDto.getBandwidth();
            crowded = wifiSpotFilterDto.getCrowded();
            coveredArea = wifiSpotFilterDto.getCoveredArea();
            airConditioning = wifiSpotFilterDto.getAirConditioning();
            goodView = wifiSpotFilterDto.getGoodView();
            noiseLevel = wifiSpotFilterDto.getNoiseLevel();
            petFriendly = wifiSpotFilterDto.getPetFriendly();
            childFriendly = wifiSpotFilterDto.getChildFriendly();
            disableAccess = wifiSpotFilterDto.getDisableAccess();
            availablePowerOutlets = wifiSpotFilterDto.getAvailablePowerOutlets();
            chargingStations = wifiSpotFilterDto.getChargingStations();
            restroomsAvailable = wifiSpotFilterDto.getRestroomsAvailable();
            parkingAvailability = wifiSpotFilterDto.getParkingAvailability();
            foodOptions = wifiSpotFilterDto.getFoodOptions();
            drinkOptions = wifiSpotFilterDto.getDrinkOptions();
            openDuringRain = wifiSpotFilterDto.getOpenDuringRain();
            openDuringHeat  = wifiSpotFilterDto.getOpenDuringHeat();
            heatedInWinter = wifiSpotFilterDto.getHeatedInWinter();
            shadedAreas  = wifiSpotFilterDto.getShadedAreas();
            outdoorFans  = wifiSpotFilterDto.getOutdoorFans();

        }


        List<WifiSpot> l =  wifiSpotRepository.findFilteredWifiSpots(
                name, description,
                locationType, wifiQuality, signalStrength,
                bandwidth, crowded, coveredArea, airConditioning,
                goodView, noiseLevel, petFriendly, childFriendly,
                disableAccess, availablePowerOutlets, chargingStations,
                restroomsAvailable, parkingAvailability, foodOptions,
                drinkOptions, openDuringRain, openDuringHeat,
                heatedInWinter, shadedAreas, outdoorFans
        );
        return l.stream().map(wifiSpotMapper::wifiSpotDomainToDto).toList();
    }

    private String escapeForLike(String input) {
        if (input == null) {
            return null;
        }
        return input
                .replace("\\", "\\\\") // Escape backslash
                .replace("%", "\\%")   // Escape percent
                .replace("_", "\\_");  // Escape underscore
    }


    @Override
    public List<WifiSpotDto> getWifiSpotsOfUser(UserDto userDto) {
        Optional<User> userOptional = userRepository.findByUsername(new Username(userDto.username()));

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = userOptional.get();
        List<WifiSpot> wifiSpots = wifiSpotRepository.findByUserId(user.getUserId());

        return wifiSpots.stream()
            .map(wifiSpotMapper::wifiSpotDomainToDto).toList();
    }


    private void createPointsEarnTransactionBasedOnWifiSpotCreation(WifiSpotDto wifiSpotDto) {
        pointsEarnTransactionService.savePointsEarnTransactionByWifiSpotCreation(
                new PointsEarnTransactionCreateByWifiSpotCreationDto(
                        wifiSpotDto.userId(), wifiSpotDto.uuid()
                )
        );

    }

    public boolean verifyOwnershipOrPermission(UUID uuid, UUID userId) {
        WifiSpot wifiSpot = wifiSpotRepository.findById(new WifiSpotId(uuid))
            .orElseThrow(() -> new EntityNotFoundException("Wi-Fi Spot not found"));

        if (!wifiSpot.getUserId().equals(userId)) {
            new Exception("You do not have permission to update this Wi-Fi Spot");
            return false;
        }
        return true;
    }
    public WifiSpotDto updateWifiSpot(UUID uuid, WifiSpotDto wifiSpotDto) {
        // Retrieve the existing Wi-Fi Spot
        WifiSpot existingSpot = wifiSpotRepository.findById(new WifiSpotId(uuid))
            .orElseThrow(() -> new EntityNotFoundException("Wi-Fi Spot not found"));

        // Update fields of the existing Wi-Fi Spot
        existingSpot.setName(wifiSpotDto.name());
        existingSpot.setDescription(wifiSpotDto.description());
        existingSpot.setLocationType(wifiSpotDto.locationType());
        existingSpot.setWifiQuality(wifiSpotDto.wifiQuality());
        existingSpot.setSignalStrength(wifiSpotDto.signalStrength());
        existingSpot.setBandwidth(wifiSpotDto.bandwidth());
        existingSpot.setCoordinates(wifiSpotDto.coordinates());
        existingSpot.setAddress(wifiSpotDto.address());
        existingSpot.setCrowded(wifiSpotDto.crowded());
        existingSpot.setCoveredArea(wifiSpotDto.coveredArea());
        existingSpot.setAirConditioning(wifiSpotDto.airConditioning());
        existingSpot.setGoodView(wifiSpotDto.goodView());
        existingSpot.setNoiseLevel(wifiSpotDto.noiseLevel());
        existingSpot.setPetFriendly(wifiSpotDto.petFriendly());
        existingSpot.setChildFriendly(wifiSpotDto.childFriendly());
        existingSpot.setDisableAccess(wifiSpotDto.disableAccess());
        existingSpot.setAvailablePowerOutlets(wifiSpotDto.availablePowerOutlets());
        existingSpot.setChargingStations(wifiSpotDto.chargingStations());
        existingSpot.setRestroomsAvailable(wifiSpotDto.restroomsAvailable());
        existingSpot.setParkingAvailability(wifiSpotDto.parkingAvailability());
        existingSpot.setFoodOptions(wifiSpotDto.foodOptions());
        existingSpot.setDrinkOptions(wifiSpotDto.drinkOptions());
        existingSpot.setOpenDuringRain(wifiSpotDto.openDuringRain());
        existingSpot.setOpenDuringHeat(wifiSpotDto.openDuringHeat());
        existingSpot.setHeatedInWinter(wifiSpotDto.heatedInWinter());
        existingSpot.setShadedAreas(wifiSpotDto.shadedAreas());
        existingSpot.setOutdoorFans(wifiSpotDto.outdoorFans());

        // Save the updated Wi-Fi Spot back to the repository
        WifiSpot updatedSpot = wifiSpotRepository.save(existingSpot);

        // Convert the updated Wi-Fi Spot entity back to a DTO and return it
        return wifiSpotMapper.wifiSpotDomainToDto(updatedSpot);
    }
}

