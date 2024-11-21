// Haversine formula to calculate the distance 
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c)/1.609 ; // Distance in miles
}

// Function to fetch coordinates for a given ZIP code
async function getCoordinates(zipCode, apiKey) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zipCode}&key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error("No results found for this ZIP code");
        }
    } catch (error) {
        console.error("Failed to fetch coordinates:", error.message);
        return null;
    }
}

// Function to calculate and display distance
async function calculateDistance(event) {
    event.preventDefault(); // Prevent form submission if button is inside form

    const zip1 = document.getElementById("zip1").value;
    const zip2 = document.getElementById("zip2").value;
    const result = document.getElementById("result");
    const apiKey = ""; // Replace with your actual API key

    result.textContent = "Calculating distance...";

    const coords1 = await getCoordinates(zip1, apiKey);
    const coords2 = await getCoordinates(zip2, apiKey);

    if (coords1 && coords2) {
        const distance = haversine(coords1.lat, coords1.lng, coords2.lat, coords2.lng);
        const costPerMile = 1.07;
        const totalCost = distance * costPerMile;

        // Corrected line: Added closing quote and parenthesis
        result.textContent = `The distance between ${zip1} and ${zip2} is ${distance.toFixed(2)} miles. Driving that distance would cost: $${totalCost.toFixed(2)}`; 
    } else {
        result.textContent = "Unable to retrieve coordinates. Please check the ZIP codes or API key.";
    }
}
// Attach event listener to button click
document.getElementById("submit-button").addEventListener("click", calculateDistance);
