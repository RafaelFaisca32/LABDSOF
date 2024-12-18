import React, {useEffect, useState} from "react";
import { Modal, Form, Button, Segment, Header } from "semantic-ui-react";

const locationTypes = [
    "Public",
    "Cafe",
    "Library",
    "Park",
    "School",
    "Restaurant",
    "Others",
];
const qualityLevels = ["High", "Medium", "Low"];
const strengthLevels = ["Strong", "Medium", "Low"];
const bandwidthOptions = ["Limited", "Unlimited"];
const noiseLevels = ["None", "Quiet", "Moderate", "Loud"];
const yesNoOptions = [
    { key: "yes", text: "Yes", value: true },
    { key: "no", text: "No", value: false },
];
export const countries = [
    { key: "al", text: "Albania", value: "al" },
    { key: "ad", text: "Andorra", value: "ad" },
    { key: "am", text: "Armenia", value: "am" },
    { key: "at", text: "Austria", value: "at" },
    { key: "az", text: "Azerbaijan", value: "az" },
    { key: "by", text: "Belarus", value: "by" },
    { key: "be", text: "Belgium", value: "be" },
    { key: "ba", text: "Bosnia and Herzegovina", value: "ba" },
    { key: "bg", text: "Bulgaria", value: "bg" },
    { key: "hr", text: "Croatia", value: "hr" },
    { key: "cy", text: "Cyprus", value: "cy" },
    { key: "cz", text: "Czech Republic", value: "cz" },
    { key: "dk", text: "Denmark", value: "dk" },
    { key: "ee", text: "Estonia", value: "ee" },
    { key: "fi", text: "Finland", value: "fi" },
    { key: "fr", text: "France", value: "fr" },
    { key: "ge", text: "Georgia", value: "ge" },
    { key: "de", text: "Germany", value: "de" },
    { key: "gr", text: "Greece", value: "gr" },
    { key: "hu", text: "Hungary", value: "hu" },
    { key: "is", text: "Iceland", value: "is" },
    { key: "ie", text: "Ireland", value: "ie" },
    { key: "it", text: "Italy", value: "it" },
    { key: "kz", text: "Kazakhstan", value: "kz" },
    { key: "xk", text: "Kosovo", value: "xk" },
    { key: "lv", text: "Latvia", value: "lv" },
    { key: "li", text: "Liechtenstein", value: "li" },
    { key: "lt", text: "Lithuania", value: "lt" },
    { key: "lu", text: "Luxembourg", value: "lu" },
    { key: "mt", text: "Malta", value: "mt" },
    { key: "md", text: "Moldova", value: "md" },
    { key: "mc", text: "Monaco", value: "mc" },
    { key: "me", text: "Montenegro", value: "me" },
    { key: "nl", text: "Netherlands", value: "nl" },
    { key: "mk", text: "North Macedonia", value: "mk" },
    { key: "no", text: "Norway", value: "no" },
    { key: "pl", text: "Poland", value: "pl" },
    { key: "pt", text: "Portugal", value: "pt" },
    { key: "ro", text: "Romania", value: "ro" },
    { key: "ru", text: "Russia", value: "ru" },
    { key: "sm", text: "San Marino", value: "sm" },
    { key: "rs", text: "Serbia", value: "rs" },
    { key: "sk", text: "Slovakia", value: "sk" },
    { key: "si", text: "Slovenia", value: "si" },
    { key: "es", text: "Spain", value: "es" },
    { key: "se", text: "Sweden", value: "se" },
    { key: "ch", text: "Switzerland", value: "ch" },
    { key: "tr", text: "Turkey", value: "tr" },
    { key: "ua", text: "Ukraine", value: "ua" },
    { key: "gb", text: "United Kingdom", value: "gb" },
    { key: "va", text: "Vatican City", value: "va" }
];


async function reverseGeocodeWithNominatim(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const response = await fetch(url);
    if (!response.ok) {
        console.error("Failed to fetch address from Nominatim");
        return null;
    }
    const data = await response.json();
    const address = data.address || {};

    return {
        addressLine1: address.road || '',
        city: address.city || address.state,
        district: address.county || '',
        country: address.country_code || '',
        zipCode: address.postcode || '',
    };
}

function AddSpotModal({open, onClose, onSave, spotDetails, setSpotDetails,isEditing}) {
    const [hasRoadName, setHasRoadName] = useState(false);
    const [activeSections, setActiveSections] = useState({
        basicInfo: true,
        quality: false,
        environmental: false,
        facilities: false,
        weather: false,
        address: false,
    });

    const toCamelCase = (str) => {
        return str
            .split(" ")
            .map((word, index) =>
                index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join("");
    };

    const handleInputChange = (e, {name, value}) => {
        setSpotDetails((prev) => ({...prev, [name]: value}));
    };

    const toggleSection = (section) => {
        setActiveSections((prev) => ({...prev, [section]: !prev[section]}));
    };

    const isMandatoryFilled = () => {
        const mandatoryFields = [
            "name",
            "description",
            "locationType",
            "wifiQuality",
            "signalStrength",
            "bandwidth",
            "crowded",
            "coveredArea",
            "airConditioning",
            "goodView",
            "petFriendly",
            "childFriendly",
            "disableAccess",
            "noiseLevel",
            "availablePowerOutlets",
            "chargingStations",
            "restroomsAvailable",
            "parkingAvailability",
            "foodOptions",
            "drinkOptions",
            "addressLine1",
            "city",
            "district",
            "country",
            "zipCode"
        ];
        return mandatoryFields.every((field) => {
            return spotDetails[field] !== undefined && spotDetails[field] !== null && spotDetails[field] !== "";
        }) && spotDetails.coordinates.lat && spotDetails.coordinates.lng;
    };

    const handleCoordinatesChange = async (lat, lng) => {
        if (lat && lng) {
            const addressData = await reverseGeocodeWithNominatim(lat, lng);
            if (addressData) {
                addressData.addressLine1 && addressData.addressLine1 !== "" ? setHasRoadName(true) : setHasRoadName(false);
                setSpotDetails((prev) => ({
                    ...prev,
                    addressLine1: addressData.addressLine1,
                    city: addressData.city,
                    district: addressData.district,
                    country: addressData.country,
                    zipCode: addressData.zipCode,
                }));
            }
        }
    };

    useEffect(() => {
        if (spotDetails && spotDetails.coordinates && spotDetails.coordinates.lat && spotDetails.coordinates.lng && !isEditing ) {
            handleCoordinatesChange(spotDetails.coordinates.lat,spotDetails.coordinates.lng);
        }
    }, [open, spotDetails.coordinates]);

    return (
        <Modal open={open} onClose={onClose} size="large">
           <Modal.Header>{isEditing ? "Edit Spot" : "Add a New Spot"}</Modal.Header>
            <Modal.Content scrolling style={{maxHeight: "70vh", overflowY: "auto"}}>
                <Form>
                    <Segment>
                        <Header as="h4" onClick={() => toggleSection("basicInfo")} style={{cursor: "pointer"}}>
                            Basic Information
                        </Header>
                        {activeSections.basicInfo && (
                            <Form.Group widths="equal">
                                <Form.Input
                                    label="Name"
                                    name="name"
                                    value={spotDetails.name || ""}
                                    onChange={handleInputChange}
                                    placeholder="Enter name"
                                    required
                                />
                                <Form.Input
                                    label="Description"
                                    name="description"
                                    value={spotDetails.description || ""}
                                    onChange={handleInputChange}
                                    placeholder="Enter description"
                                    required
                                />
                                <Form.Dropdown
                                    label="Location Type"
                                    name="locationType"
                                    options={locationTypes.map((type) => ({
                                        key: type,
                                        text: type,
                                        value: type.toUpperCase(),
                                    }))}
                                    value={spotDetails.locationType || ""}
                                    onChange={handleInputChange}
                                    placeholder="Select location type"
                                    selection
                                    required
                                />
                            </Form.Group>
                        )}
                    </Segment>

                    <Segment>
                        <Header as="h4" onClick={() => toggleSection("quality")} style={{cursor: "pointer"}}>
                            Quality
                        </Header>
                        {activeSections.quality && (
                            <Form>
                                <Form.Group widths="equal">
                                    <Form.Dropdown
                                        label="Wifi Quality"
                                        name="wifiQuality"
                                        options={qualityLevels.map((level) => ({
                                            key: level,
                                            text: level,
                                            value: level.toUpperCase(),
                                        }))}
                                        value={spotDetails.wifiQuality || ""}
                                        onChange={handleInputChange}
                                        placeholder="Select wifi quality"
                                        selection
                                        required
                                    />
                                    <Form.Dropdown
                                        label="Signal Strength"
                                        name="signalStrength"
                                        options={strengthLevels.map((level) => ({
                                            key: level,
                                            text: level,
                                            value: level.toUpperCase(),
                                        }))}
                                        value={spotDetails.signalStrength || ""}
                                        onChange={handleInputChange}
                                        placeholder="Select signal strength"
                                        selection
                                        required
                                    />
                                    <Form.Dropdown
                                        label="Bandwidth Limitations"
                                        name="bandwidth"
                                        options={bandwidthOptions.map((option) => ({
                                            key: option,
                                            text: option,
                                            value: option.toUpperCase(),
                                        }))}
                                        value={spotDetails.bandwidth || ""}
                                        onChange={handleInputChange}
                                        placeholder="Select bandwidth limitation"
                                        selection
                                        required
                                    />
                                </Form.Group>
                                <Form.Group widths="equal">
                                    <Form.Input
                                        label="Peak Usage Start (HH:MM:SS)"
                                        name="peakUsageStart"
                                        type="time"
                                        value={spotDetails.peakUsageStart || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter start time"
                                    />
                                    <Form.Input
                                        label="Peak Usage End (HH:MM:SS)"
                                        name="peakUsageEnd"
                                        type="time"
                                        value={spotDetails.peakUsageEnd || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter end time"
                                    />
                                </Form.Group>
                            </Form>
                        )}
                    </Segment>

                    <Segment>
                        <Header
                            as="h4"
                            onClick={() => toggleSection("environmental")}
                            style={{cursor: "pointer"}}
                        >
                            Environmental Features
                        </Header>
                        {activeSections.environmental && (
                            <Form>
                                {/* First Row: Crowded, Covered Area, Air Conditioning, Good View */}
                                <Form.Group widths="equal">
                                    {["Crowded", "Covered Area", "Air Conditioning", "Good View"].map(
                                        (feature) => (
                                            <Form.Dropdown
                                                key={feature}
                                                label={feature}
                                                name={toCamelCase(feature)}
                                                options={yesNoOptions}
                                                value={spotDetails[toCamelCase(feature)]}
                                                onChange={handleInputChange}
                                                placeholder={`Is ${feature.toLowerCase()}?`}
                                                selection
                                                required
                                            />
                                        )
                                    )}
                                </Form.Group>

                                {/* Second Row: Noise Level */}
                                <Form.Group widths="equal">
                                    <Form.Dropdown
                                        label="Noise Level"
                                        name="noiseLevel"
                                        options={noiseLevels.map((type) => ({
                                            key: type,
                                            text: type,
                                            value: type.toUpperCase(),
                                        }))}
                                        value={spotDetails.noiseLevel || ""}
                                        onChange={handleInputChange}
                                        placeholder="Select noise level"
                                        selection
                                        required
                                    />
                                </Form.Group>

                                {/* Third Row: Pet Friendly, Child Friendly, Disable Access */}
                                <Form.Group widths="equal">
                                    {["Pet Friendly", "Child Friendly", "Disable Access"].map(
                                        (feature) => (
                                            <Form.Dropdown
                                                key={feature}
                                                label={feature}
                                                name={toCamelCase(feature)}
                                                options={yesNoOptions}
                                                value={spotDetails[toCamelCase(feature)]}
                                                onChange={handleInputChange}
                                                placeholder={`Is ${feature.toLowerCase()}?`}
                                                selection
                                                required
                                            />
                                        )
                                    )}
                                </Form.Group>
                            </Form>
                        )}
                    </Segment>

                    <Segment>
                        <Header
                            as="h4"
                            onClick={() => toggleSection("facilities")}
                            style={{cursor: "pointer"}}
                        >
                            Facilities
                        </Header>
                        {activeSections.facilities && (
                            <>
                                {/* First Row */}
                                <Form.Group widths="equal">
                                    {[
                                        "Available Power Outlets",
                                        "Charging Stations",
                                        "Restrooms Available",
                                    ].map((facility) => (
                                        <Form.Dropdown
                                            key={facility}
                                            label={facility}
                                            name={toCamelCase(facility)}
                                            options={yesNoOptions}
                                            value={spotDetails[toCamelCase(facility)]}
                                            onChange={handleInputChange}
                                            placeholder={`Is ${facility.toLowerCase()} available?`}
                                            selection
                                            required
                                        />
                                    ))}
                                </Form.Group>
                                {/* Second Row */}
                                <Form.Group widths="equal">
                                    {["Parking Availability", "Food Options", "Drink Options"].map(
                                        (facility) => (
                                            <Form.Dropdown
                                                key={facility}
                                                label={facility}
                                                name={toCamelCase(facility)}
                                                options={yesNoOptions}
                                                value={spotDetails[toCamelCase(facility)]}
                                                onChange={handleInputChange}
                                                placeholder={`Is ${facility.toLowerCase()} available?`}
                                                selection
                                                required
                                            />
                                        )
                                    )}
                                </Form.Group>
                            </>
                        )}
                    </Segment>

                    <Segment>
                        <Header
                            as="h4"
                            onClick={() => toggleSection("weather")}
                            style={{cursor: "pointer"}}
                        >
                            Weather Features
                        </Header>
                        {activeSections.weather && (
                            <>
                                {/* First Row */}
                                <Form.Group widths="equal">
                                    {["Open during Rain", "Open during Heat", "Heated in Winter"].map(
                                        (weatherFeature) => (
                                            <Form.Dropdown
                                                key={weatherFeature}
                                                label={weatherFeature}
                                                name={toCamelCase(weatherFeature)}
                                                options={yesNoOptions}
                                                value={spotDetails[toCamelCase(weatherFeature)]}
                                                onChange={handleInputChange}
                                                placeholder={`Is ${weatherFeature.toLowerCase()} supported?`}
                                                selection
                                            />
                                        )
                                    )}
                                </Form.Group>
                                {/* Second Row */}
                                <Form.Group widths="equal">
                                    {["Shaded Areas", "Outdoor Fans"].map((weatherFeature) => (
                                        <Form.Dropdown
                                            key={weatherFeature}
                                            label={weatherFeature}
                                            name={toCamelCase(weatherFeature)}
                                            options={yesNoOptions}
                                            value={spotDetails[toCamelCase(weatherFeature)]}
                                            onChange={handleInputChange}
                                            placeholder={`Is ${weatherFeature.toLowerCase()} supported?`}
                                            selection
                                        />
                                    ))}
                                </Form.Group>
                            </>
                        )}
                    </Segment>

                    <Segment>
                        <Header
                            as="h4"
                            onClick={() => toggleSection("address")}
                            style={{cursor: "pointer"}}
                        >
                            Address
                        </Header>
                        {activeSections.address && (
                            <>
                                {/* First Row */}
                                <Form.Group widths="equal">
                                    <Form.Input
                                        label="Address Line 1"
                                        name="addressLine1"
                                        value={spotDetails.addressLine1 || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter address line 1"
                                        required
                                        readOnly={hasRoadName}
                                    />
                                    <Form.Input
                                        label="Address Line 2"
                                        name="addressLine2"
                                        value={spotDetails.addressLine2 || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter address line 2 (optional)"
                                    />
                                    <Form.Input
                                        label="City"
                                        name="city"
                                        value={spotDetails.city || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                        pattern="[A-Za-z]+"
                                        required
                                        readOnly
                                    />
                                </Form.Group>

                                {/* Second Row */}
                                <Form.Group widths="equal">
                                    <Form.Input
                                        label="District"
                                        name="district"
                                        value={spotDetails.district || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter district"
                                        pattern="[A-Za-z]+"
                                        required
                                        readOnly
                                    />
                                    <Form.Dropdown
                                        label="Country"
                                        name="country"
                                        options={countries.map((country) => ({
                                            key: country.key,
                                            text: country.text,
                                            value: country.value,
                                        }))}
                                        value={spotDetails.country || ""}
                                        onChange={handleInputChange}
                                        placeholder="Select a country"
                                        selection
                                        required
                                        readOnly
                                    />
                                    <Form.Input
                                        label="Zip Code"
                                        name="zipCode"
                                        value={spotDetails.zipCode || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter zip code"
                                        required
                                        readOnly
                                    />
                                </Form.Group>

                                {/* Third Row */}
                                <Form.Group widths="equal">
                                    <Form.Input
                                        type="number"
                                        label="Latitude"
                                        name="latitude"
                                        value={spotDetails.coordinates.lat || ""}
                                        onChange={handleInputChange}
                                        required
                                        readOnly
                                    />
                                    <Form.Input
                                        type="number"
                                        label="Longitude"
                                        name="longitude"
                                        value={spotDetails.coordinates.lng || ""}
                                        onChange={handleInputChange}
                                        required
                                        readOnly
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Segment>
                </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                primary
                onClick={onSave}
                disabled={!isMandatoryFilled()}
              >
                {isEditing ? "Save Changes" : "Add Spot"}
              </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default AddSpotModal;
