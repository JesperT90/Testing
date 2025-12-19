// Initialize map
let mapCanvas;
let mapCtx;
let markers = [];
let sampleLocations = [];
let mapCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
let mapZoom = 10;
let isDragging = false;
let lastMousePos = { x: 0, y: 0 };

// Initialize the map
function initMap() {
    mapCanvas = document.getElementById('map');
    mapCtx = mapCanvas.getContext('2d');
    
    // Set canvas size
    mapCanvas.width = mapCanvas.offsetWidth;
    mapCanvas.height = mapCanvas.offsetHeight;
    
    // Add event listeners for interaction
    mapCanvas.addEventListener('mousedown', handleMouseDown);
    mapCanvas.addEventListener('mousemove', handleMouseMove);
    mapCanvas.addEventListener('mouseup', handleMouseUp);
    mapCanvas.addEventListener('wheel', handleWheel);
    
    // Draw initial map
    drawMap();
}

// Convert lat/lng to canvas coordinates
function latLngToCanvas(lat, lng) {
    const scale = Math.pow(2, mapZoom);
    const x = ((lng + 180) / 360 * scale * 256) - (mapCenter.lng + 180) / 360 * scale * 256 + mapCanvas.width / 2;
    const y = ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * scale * 256) - 
              ((1 - Math.log(Math.tan(mapCenter.lat * Math.PI / 180) + 1 / Math.cos(mapCenter.lat * Math.PI / 180)) / Math.PI) / 2 * scale * 256) + 
              mapCanvas.height / 2;
    return { x, y };
}

// Draw the map
function drawMap() {
    // Clear canvas
    mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    
    // Draw background
    const gradient = mapCtx.createLinearGradient(0, 0, 0, mapCanvas.height);
    gradient.addColorStop(0, '#b8d4f1');
    gradient.addColorStop(1, '#e6f2ff');
    mapCtx.fillStyle = gradient;
    mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    
    // Draw grid
    mapCtx.strokeStyle = '#ccc';
    mapCtx.lineWidth = 1;
    for (let i = 0; i < mapCanvas.width; i += 50) {
        mapCtx.beginPath();
        mapCtx.moveTo(i, 0);
        mapCtx.lineTo(i, mapCanvas.height);
        mapCtx.stroke();
    }
    for (let i = 0; i < mapCanvas.height; i += 50) {
        mapCtx.beginPath();
        mapCtx.moveTo(0, i);
        mapCtx.lineTo(mapCanvas.width, i);
        mapCtx.stroke();
    }
    
    // Draw markers
    markers.forEach(marker => {
        const pos = latLngToCanvas(marker.lat, marker.lng);
        if (pos.x >= 0 && pos.x <= mapCanvas.width && pos.y >= 0 && pos.y <= mapCanvas.height) {
            // Draw marker shadow
            mapCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            mapCtx.beginPath();
            mapCtx.arc(pos.x + 2, pos.y + 2, 8, 0, Math.PI * 2);
            mapCtx.fill();
            
            // Draw marker
            mapCtx.fillStyle = marker.color;
            mapCtx.beginPath();
            mapCtx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
            mapCtx.fill();
            
            // Draw marker border
            mapCtx.strokeStyle = 'white';
            mapCtx.lineWidth = 2;
            mapCtx.stroke();
            
            // Draw label
            mapCtx.fillStyle = '#333';
            mapCtx.font = 'bold 10px sans-serif';
            mapCtx.fillText(marker.name, pos.x + 12, pos.y + 4);
        }
    });
    
    // Draw center crosshair
    mapCtx.strokeStyle = 'rgba(102, 126, 234, 0.5)';
    mapCtx.lineWidth = 2;
    mapCtx.beginPath();
    mapCtx.moveTo(mapCanvas.width / 2 - 10, mapCanvas.height / 2);
    mapCtx.lineTo(mapCanvas.width / 2 + 10, mapCanvas.height / 2);
    mapCtx.moveTo(mapCanvas.width / 2, mapCanvas.height / 2 - 10);
    mapCtx.lineTo(mapCanvas.width / 2, mapCanvas.height / 2 + 10);
    mapCtx.stroke();
    
    // Draw zoom level
    mapCtx.fillStyle = '#333';
    mapCtx.font = '12px sans-serif';
    mapCtx.fillText(`Zoom: ${mapZoom}`, 10, 20);
    mapCtx.fillText(`Center: ${mapCenter.lat.toFixed(2)}, ${mapCenter.lng.toFixed(2)}`, 10, 35);
}

// Handle mouse events
function handleMouseDown(e) {
    isDragging = true;
    lastMousePos = { x: e.offsetX, y: e.offsetY };
    mapCanvas.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
    if (isDragging) {
        const dx = e.offsetX - lastMousePos.x;
        const dy = e.offsetY - lastMousePos.y;
        
        // Update map center
        const scale = Math.pow(2, mapZoom);
        mapCenter.lng -= dx / (scale * 256) * 360;
        mapCenter.lat += dy / (scale * 256) * 360;
        
        lastMousePos = { x: e.offsetX, y: e.offsetY };
        drawMap();
    } else {
        // Check if hovering over a marker
        let hovering = false;
        for (const marker of markers) {
            const pos = latLngToCanvas(marker.lat, marker.lng);
            const dist = Math.sqrt(Math.pow(e.offsetX - pos.x, 2) + Math.pow(e.offsetY - pos.y, 2));
            if (dist < 10) {
                hovering = true;
                mapCanvas.style.cursor = 'pointer';
                break;
            }
        }
        if (!hovering) {
            mapCanvas.style.cursor = 'grab';
        }
    }
}

function handleMouseUp(e) {
    if (isDragging) {
        isDragging = false;
        mapCanvas.style.cursor = 'grab';
    }
    
    // Check if clicked on a marker
    for (const marker of markers) {
        const pos = latLngToCanvas(marker.lat, marker.lng);
        const dist = Math.sqrt(Math.pow(e.offsetX - pos.x, 2) + Math.pow(e.offsetY - pos.y, 2));
        if (dist < 10) {
            alert(`${marker.name}\nScore: ${marker.score}/100\nPopulation: ${marker.population.toLocaleString()}\nAvg Income: $${marker.avgIncome.toLocaleString()}\nCompetition: ${marker.competition}\nTraffic: ${marker.traffic}`);
            break;
        }
    }
}

function handleWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) {
        mapZoom = Math.min(mapZoom + 1, 15);
    } else {
        mapZoom = Math.max(mapZoom - 1, 1);
    }
    drawMap();
}

// Generate sample location data for demonstration
function generateSampleLocations(centerLat, centerLng, count = 10) {
    const locations = [];
    const businessTypes = ['retail', 'restaurant', 'office', 'warehouse', 'service'];
    const cityNames = [
        'Downtown District', 'Financial District', 'Shopping Plaza', 
        'Business Park', 'Tech Quarter', 'Market Street', 
        'Commerce Center', 'Industrial Zone', 'Retail Hub', 
        'Service District', 'Mixed-Use Area', 'Urban Center'
    ];

    for (let i = 0; i < count; i++) {
        // Generate random coordinates within ~10 mile radius
        const lat = centerLat + (Math.random() - 0.5) * 0.3;
        const lng = centerLng + (Math.random() - 0.5) * 0.3;

        locations.push({
            id: i + 1,
            name: cityNames[i % cityNames.length] + ' ' + (Math.floor(i / cityNames.length) + 1),
            lat: lat,
            lng: lng,
            population: Math.floor(Math.random() * 200000) + 10000,
            avgIncome: Math.floor(Math.random() * 100000) + 30000,
            competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            traffic: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            proximity: ['close', 'moderate', 'far'][Math.floor(Math.random() * 3)],
            rentCost: Math.floor(Math.random() * 5000) + 1000,
            businessType: businessTypes[Math.floor(Math.random() * businessTypes.length)]
        });
    }

    return locations;
}

// Calculate location score based on criteria
function calculateScore(location, criteria) {
    let score = 0;
    let maxScore = 100;

    // Population score (20 points)
    if (location.population >= criteria.population) {
        score += 20 * (location.population / (criteria.population + 50000));
        score = Math.min(score, 20);
    } else {
        score += 10 * (location.population / criteria.population);
    }

    // Income score (20 points)
    if (location.avgIncome >= criteria.income) {
        score += 20 * (location.avgIncome / (criteria.income + 30000));
        score = Math.min(score, 20);
    } else {
        score += 10 * (location.avgIncome / criteria.income);
    }

    // Competition score (20 points)
    const competitionMap = { low: 20, medium: 12, high: 5 };
    const preferredCompetition = criteria.competition;
    if (location.competition === preferredCompetition) {
        score += competitionMap[location.competition];
    } else if (location.competition === 'low') {
        score += 15;
    } else if (location.competition === 'medium') {
        score += 10;
    } else {
        score += 5;
    }

    // Traffic score (20 points)
    const trafficMap = { high: 20, medium: 12, low: 5 };
    const preferredTraffic = criteria.trafficVolume;
    if (location.traffic === preferredTraffic) {
        score += trafficMap[location.traffic];
    } else if (location.traffic === 'high') {
        score += 15;
    } else if (location.traffic === 'medium') {
        score += 10;
    } else {
        score += 5;
    }

    // Proximity score (20 points)
    const proximityMap = { close: 20, moderate: 12, far: 5 };
    if (location.proximity === criteria.proximity) {
        score += proximityMap[location.proximity];
    } else if (location.proximity === 'close') {
        score += 15;
    } else if (location.proximity === 'moderate') {
        score += 10;
    } else {
        score += 5;
    }

    return Math.min(Math.round(score), maxScore);
}

// Get score category and color
function getScoreCategory(score) {
    if (score >= 80) return { label: 'Excellent', class: 'score-excellent' };
    if (score >= 60) return { label: 'Good', class: 'score-good' };
    if (score >= 40) return { label: 'Fair', class: 'score-fair' };
    return { label: 'Poor', class: 'score-poor' };
}

// Clear existing markers
function clearMarkers() {
    markers = [];
}

// Add markers to map
function addMarkersToMap(locations) {
    clearMarkers();

    locations.forEach(location => {
        const scoreCategory = getScoreCategory(location.score);
        const markerColor = scoreCategory.class === 'score-excellent' ? '#10b981' :
                           scoreCategory.class === 'score-good' ? '#3b82f6' :
                           scoreCategory.class === 'score-fair' ? '#f59e0b' : '#ef4444';

        markers.push({
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            color: markerColor,
            score: location.score,
            population: location.population,
            avgIncome: location.avgIncome,
            competition: location.competition,
            traffic: location.traffic
        });
    });

    // Fit map to show all markers
    if (locations.length > 0) {
        const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
        const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
        mapCenter = { lat: avgLat, lng: avgLng };
    }
    
    drawMap();
}

// Display locations in the list
function displayLocations(locations) {
    const locationsList = document.getElementById('locationsList');
    
    if (locations.length === 0) {
        locationsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No locations analyzed yet. Click "Analyze Locations" to start.</p>';
        return;
    }

    // Sort by score (highest first)
    locations.sort((a, b) => b.score - a.score);

    locationsList.innerHTML = locations.map(location => {
        const scoreCategory = getScoreCategory(location.score);
        return `
            <div class="location-card">
                <h3>${location.name}</h3>
                <span class="location-score ${scoreCategory.class}">
                    ${location.score}/100 - ${scoreCategory.label}
                </span>
                <div class="location-details">
                    <div class="detail-item">
                        <strong>Population:</strong> ${location.population.toLocaleString()}
                    </div>
                    <div class="detail-item">
                        <strong>Avg Income:</strong> $${location.avgIncome.toLocaleString()}
                    </div>
                    <div class="detail-item">
                        <strong>Competition:</strong> ${location.competition}
                    </div>
                    <div class="detail-item">
                        <strong>Traffic:</strong> ${location.traffic}
                    </div>
                    <div class="detail-item">
                        <strong>Transport:</strong> ${location.proximity}
                    </div>
                    <div class="detail-item">
                        <strong>Rent:</strong> $${location.rentCost.toLocaleString()}/mo
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Search for a location
async function searchLocation(query) {
    if (!query.trim()) {
        alert('Please enter a location to search');
        return;
    }

    // For demo purposes, simulate search with predefined locations
    const locations = {
        'san francisco': { lat: 37.7749, lng: -122.4194 },
        'new york': { lat: 40.7128, lng: -74.0060 },
        'los angeles': { lat: 34.0522, lng: -118.2437 },
        'chicago': { lat: 41.8781, lng: -87.6298 },
        'houston': { lat: 29.7604, lng: -95.3698 },
        'london': { lat: 51.5074, lng: -0.1278 },
        'paris': { lat: 48.8566, lng: 2.3522 },
        'tokyo': { lat: 35.6762, lng: 139.6503 },
        'sydney': { lat: -33.8688, lng: 151.2093 },
        'toronto': { lat: 43.6532, lng: -79.3832 }
    };
    
    const queryLower = query.toLowerCase();
    let found = false;
    
    for (const [city, coords] of Object.entries(locations)) {
        if (queryLower.includes(city)) {
            mapCenter = coords;
            mapZoom = 11;
            sampleLocations = generateSampleLocations(coords.lat, coords.lng, 15);
            drawMap();
            found = true;
            break;
        }
    }
    
    if (!found) {
        alert('Location not found. Try: San Francisco, New York, Los Angeles, Chicago, Houston, London, Paris, Tokyo, Sydney, or Toronto');
    }
}

// Analyze locations based on criteria
function analyzeLocations() {
    const criteria = {
        businessType: document.getElementById('businessType').value,
        population: parseInt(document.getElementById('population').value),
        income: parseInt(document.getElementById('income').value),
        competition: document.getElementById('competition').value,
        trafficVolume: document.getElementById('trafficVolume').value,
        proximity: document.getElementById('proximity').value
    };

    // If no sample locations exist, generate some at current map center
    if (sampleLocations.length === 0) {
        sampleLocations = generateSampleLocations(mapCenter.lat, mapCenter.lng, 15);
    }

    // Calculate scores for all locations
    const analyzedLocations = sampleLocations.map(location => ({
        ...location,
        score: calculateScore(location, criteria)
    }));

    // Update map and list
    addMarkersToMap(analyzedLocations);
    displayLocations(analyzedLocations);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    initMap();

    // Generate initial sample data
    sampleLocations = generateSampleLocations(37.7749, -122.4194, 15);

    // Set up event listeners
    document.getElementById('searchBtn').addEventListener('click', function() {
        const query = document.getElementById('searchInput').value;
        searchLocation(query);
    });

    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value;
            searchLocation(query);
        }
    });

    document.getElementById('analyzeBtn').addEventListener('click', analyzeLocations);

    // Initial display
    displayLocations([]);
});
