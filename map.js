// Initialize the map
const map = L.map('map').setView([20, 0], 2); // Center of the world

// Set up the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Sample data for different locations and their temperatures
const locations = [
    { name: 'New York', coords: [40.7128, -74.0060], temperature: '15°C' },
    { name: 'Los Angeles', coords: [34.0522, -118.2437], temperature: '22°C' },
    { name: 'London', coords: [51.5074, -0.1278], temperature: '12°C' },
    { name: 'Tokyo', coords: [35.6762, 139.6503], temperature: '18°C' },
    { name: 'Sydney', coords: [-33.8688, 151.2093], temperature: '24°C' },
    { name: 'India', coords: [20.5937, 78.9629], temperature: '24°C' }

];

// Create markers for each location
locations.forEach(location => {
    const marker = L.marker(location.coords).addTo(map);
    marker.bindPopup(`<b>${location.name}</b><br>Temperature: ${location.temperature}`);
});
