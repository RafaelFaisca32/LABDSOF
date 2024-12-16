package com.netquest.wifispot;

import com.netquest.domain.shared.*;
import com.netquest.domain.user.dto.UserDto;
import com.netquest.domain.user.model.*;
import com.netquest.domain.wifispot.dto.WifiSpotAddressDto;
import com.netquest.domain.wifispot.dto.WifiSpotDto;
import com.netquest.domain.wifispot.mapper.WifiSpotMapper;
import com.netquest.domain.wifispot.model.*;
import com.netquest.domain.wifispot.service.WifiSpotService;
import com.netquest.domain.wifispot.service.impl.WifiSpotServiceImpl;
import com.netquest.infrastructure.user.UserRepository;
import com.netquest.infrastructure.wifispot.WifiSpotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WifiSpotServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private WifiSpotRepository wifiSpotRepository;

    @Mock
    private WifiSpotMapper wifiSpotMapper;

    @InjectMocks
    private WifiSpotServiceImpl wifiSpotService; // Use the implementation class

    private UserDto userDto;
    private User user;
    private WifiSpot wifiSpot;
    private WifiSpotDto wifiSpotDto;

    @BeforeEach
    void setUp() {
        // UUID for the User
        UUID userId = UUID.randomUUID();

        // Initialize UserDto
        userDto = new UserDto(
            userId,
            "testUser",
            "John",
            "Doe",
            "Male",
            "password123",
            "john.doe@example.com",
            "USER",
            LocalDate.of(1990, 1, 1),
            "123456789",
            "123 Main St",
            "Apt 4B",
            "Springfield",
            "IL",
            "USA",
            "62704"
        );

        // Initialize User with embedded fields
        user = new User(
            new UserFirstName("John"),
            new UserLastName("Doe"),
            UserGender.MALE,
            new Username("testUser"),
            new UserPassword("password123"),
            new UserMail("john.doe@example.com"),
            new UserBirthDate(LocalDate.of(1990, 1, 1)),
            UserRole.USER,
            new UserAddress(
                "123 Main St", "Apt 4B", "Springfield", "IL", "USA", "62704"
            ),
            new UserVATNumber("123456789")
        );
        user.setUserId(new UserId(userId));

        // Initialize WifiSpot with embedded fields
        WifiSpotAddress wifiSpotAddress = new WifiSpotAddress(
            new WifiSpotAddressCountry("USA"),
            new WifiSpotAddressZipCode("94103"),
            new WifiSpotAddressLine1("456 Another St"),
            new WifiSpotAddressLine2("Suite 789"),
            new WifiSpotAddressCity("San Francisco"),
            new WifiSpotAddressDistrict("CA")
        );
        wifiSpot = new WifiSpot(
            new WifiSpotName("Test Spot"),
            new WifiSpotDescription("A cozy place with good WiFi."),
            new WifiSpotCoordinates(37.7749, -122.4194),
            new WifiSpotLocationType(LocationType.CAFE),
            new WifiSpotQualityIndicators(QualityType.HIGH,  StrengthType.STRONG,BandwithType.UNLIMITED, new WifiSpotPeakUsageInterval(LocalTime.of(9, 0),
                LocalTime.of(17, 0))),
            new WifiSpotEnvironmentalFeatures(false, true, true, true, true, NoiseType.LOUD, true, true, true),
            new WifiSpotFacilities(true, true, true, true, true, true),
            new WifiSpotWeatherFeatures(true, true, false, true, false),
            wifiSpotAddress,
            new WifiSpotManagement(WifiSpotManagementType.UNVERIFIED),
            new UserId(userId)
        );
        // Mock the mapper to return WifiSpotDto
        WifiSpotAddressDto wifiSpotAddressDto = new WifiSpotAddressDto(
            UUID.randomUUID(),        // Unique ID for the address
            "USA",                   // Country
            "94103",                 // Zip code
            "456 Another St",        // Address line 1
            "Suite 789",             // Address line 2
            "San Francisco",         // City
            "CA"                     // District
        );

        // Create a WifiSpotDto
         wifiSpotDto = new WifiSpotDto(
            UUID.randomUUID(),        // Unique ID for the WifiSpot
            userId  ,     // User ID
            "Test Spot",              // Name
            "A cozy place with good WiFi.", // Description
            37.7749,                  // Latitude
            -122.4194,                // Longitude
            LocationType.CAFE,        // Location type
            QualityType.HIGH,         // WiFi quality
            StrengthType.STRONG,      // Signal strength
            BandwithType.UNLIMITED,   // Bandwidth
            LocalTime.of(9, 0),       // Peak usage start time
            LocalTime.of(17, 0),      // Peak usage end time
            false,                    // Crowded
            true,                     // Covered area
            true,                     // Air conditioning
            true,                     // Outdoor seating
            true,                     // Good view
            NoiseType.MODERATE,       // Noise level
            true,                     // Pet friendly
            true,                     // Child friendly
            true,                     // Disable access
            true,                     // Available power outlets
            true,                     // Charging stations
            true,                     // Restrooms available
            true,                     // Parking availability
            true,                     // Food options
            true,                     // Drink options
            true,                     // Open during rain
            true,                     // Open during heat
            false,                    // Heated in winter
            true,                     // Shaded areas
            true,                     // Outdoor fans
            wifiSpotAddressDto,       // Address DTO
            WifiSpotManagementType.UNVERIFIED, // Management type
            LocalDateTime.now()       // Date/time created
        );
    }

    @Test
    void testGetWifiSpotsOfUser_UserFound() {
        // Arrange
        when(userRepository.findByUsername(new Username(userDto.username()))).thenReturn(Optional.of(user));
        when(wifiSpotRepository.findByUserId(user.getUserId())).thenReturn(List.of(wifiSpot));
        when(wifiSpotMapper.wifiSpotDomainToDto(wifiSpot)).thenReturn(wifiSpotDto);

        // Act
        List<WifiSpotDto> result = wifiSpotService.getWifiSpotsOfUser(userDto);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        WifiSpotDto resultDto = result.get(0);

        // Validate WifiSpotDto fields
        assertEquals("Test Spot", resultDto.name());
        assertEquals("A cozy place with good WiFi.", resultDto.description());
        assertEquals(37.7749, resultDto.latitude());
        assertEquals(-122.4194, resultDto.longitude());
        assertEquals(LocationType.CAFE, resultDto.locationType());
        assertEquals(QualityType.HIGH, resultDto.wifiQuality());
        assertEquals(StrengthType.STRONG, resultDto.signalStrength());
        assertEquals(BandwithType.UNLIMITED, resultDto.bandwidth());
        assertEquals(LocalTime.of(9, 0), resultDto.peakUsageStart());
        assertEquals(LocalTime.of(17, 0), resultDto.peakUsageEnd());
        assertTrue(resultDto.airConditioning());
        assertEquals(NoiseType.MODERATE, resultDto.noiseLevel());
        assertTrue(resultDto.foodOptions());

        // Validate WifiSpotAddressDto fields
        WifiSpotAddressDto address = resultDto.address();
        assertEquals("USA", address.country());
        assertEquals("94103", address.zipCode());
        assertEquals("San Francisco", address.city());
        assertEquals("CA", address.district());

        // Verify repository and mapper interactions
        verify(userRepository, times(1)).findByUsername(new Username(userDto.username()));
        verify(wifiSpotRepository, times(1)).findByUserId(user.getUserId());
        verify(wifiSpotMapper, times(1)).wifiSpotDomainToDto(wifiSpot);
    }
    

}
