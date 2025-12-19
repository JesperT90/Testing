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
// NOTE: This generates random demo data. In a production environment, this should be replaced
// with API calls to real data sources such as:
// - US Census Bureau API (demographics, population, income data)
// - Google Places API (business density, competition analysis)
// - Real estate APIs like Zillow or Redfin (rent/property costs)
// - Traffic data from Google Maps API or similar
// - Local government open data portals
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
            medianIncome: Math.floor(Math.random() * 90000) + 28000,
            competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            traffic: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            proximity: ['close', 'moderate', 'far'][Math.floor(Math.random() * 3)],
            rentCost: Math.floor(Math.random() * 5000) + 1000,
            businessType: businessTypes[Math.floor(Math.random() * businessTypes.length)],
            // Nya svenska datapunkter
            housesCount: Math.floor(Math.random() * 5000) + 100,
            averageAge: Math.floor(Math.random() * 20) + 35,
            renovationIndex: Math.floor(Math.random() * 100) + 1,
            newConstructionIndex: Math.floor(Math.random() * 100) + 1,
            buildingMaterialsTurnover: Math.floor(Math.random() * 10000000) + 500000
        });
    }

    return locations;
}

// Calculate location score based on criteria
function calculateScore(location, criteria) {
    let totalScore = 0;

    // Population score (20 points max)
    let populationScore = 0;
    if (location.population >= criteria.population) {
        populationScore = 20 * Math.min(location.population / (criteria.population + 50000), 1);
    } else {
        populationScore = 10 * (location.population / criteria.population);
    }
    totalScore += populationScore;

    // Income score (20 points max)
    let incomeScore = 0;
    if (location.avgIncome >= criteria.income) {
        incomeScore = 20 * Math.min(location.avgIncome / (criteria.income + 30000), 1);
    } else {
        incomeScore = 10 * (location.avgIncome / criteria.income);
    }
    totalScore += incomeScore;

    // Competition score (20 points max)
    const competitionMap = { low: 20, medium: 12, high: 5 };
    const preferredCompetition = criteria.competition;
    if (location.competition === preferredCompetition) {
        totalScore += competitionMap[location.competition];
    } else if (location.competition === 'low') {
        totalScore += 15;
    } else if (location.competition === 'medium') {
        totalScore += 10;
    } else {
        totalScore += 5;
    }

    // Traffic score (20 points max)
    const trafficMap = { high: 20, medium: 12, low: 5 };
    const preferredTraffic = criteria.trafficVolume;
    if (location.traffic === preferredTraffic) {
        totalScore += trafficMap[location.traffic];
    } else if (location.traffic === 'high') {
        totalScore += 15;
    } else if (location.traffic === 'medium') {
        totalScore += 10;
    } else {
        totalScore += 5;
    }

    // Proximity score (20 points max)
    const proximityMap = { close: 20, moderate: 12, far: 5 };
    if (location.proximity === criteria.proximity) {
        totalScore += proximityMap[location.proximity];
    } else if (location.proximity === 'close') {
        totalScore += 15;
    } else if (location.proximity === 'moderate') {
        totalScore += 10;
    } else {
        totalScore += 5;
    }

    // Return score capped at 100
    return Math.min(Math.round(totalScore), 100);
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
                        <strong>Befolkning:</strong> ${location.population.toLocaleString()}
                    </div>
                    <div class="detail-item">
                        <strong>Medellön:</strong> ${location.avgIncome.toLocaleString()} kr
                    </div>
                    <div class="detail-item">
                        <strong>Medianlön:</strong> ${location.medianIncome ? location.medianIncome.toLocaleString() + ' kr' : 'N/A'}
                    </div>
                    <div class="detail-item">
                        <strong>Snittålder:</strong> ${location.averageAge || 'N/A'} år
                    </div>
                    <div class="detail-item">
                        <strong>Villor/Radhus:</strong> ${location.housesCount ? location.housesCount.toLocaleString() : 'N/A'}
                    </div>
                    <div class="detail-item">
                        <strong>Konkurrens:</strong> ${location.competition}
                    </div>
                    <div class="detail-item">
                        <strong>Trafik:</strong> ${location.traffic}
                    </div>
                    <div class="detail-item">
                        <strong>Transport:</strong> ${location.proximity}
                    </div>
                    <div class="detail-item">
                        <strong>Hyra:</strong> ${location.rentCost.toLocaleString()} kr/mån
                    </div>
                    <div class="detail-item">
                        <strong>Renoveringsindex:</strong> ${location.renovationIndex || 'N/A'}
                    </div>
                    <div class="detail-item">
                        <strong>Nybyggnadsindex:</strong> ${location.newConstructionIndex || 'N/A'}
                    </div>
                    <div class="detail-item">
                        <strong>Byggmaterial (oms.):</strong> ${location.buildingMaterialsTurnover ? (location.buildingMaterialsTurnover / 1000000).toFixed(1) + ' Mkr' : 'N/A'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Search for a location
async function searchLocation(query) {
    if (!query.trim()) {
        alert('Vänligen ange en plats att söka efter');
        return;
    }

    // Svenska städer och kommuner där K-Bygg finns
    const locations = {
        'stockholm': { lat: 59.3293, lng: 18.0686 },
        'täby': { lat: 59.4439, lng: 18.0658 },
        'södertälje': { lat: 59.1955, lng: 17.6253 },
        'järfälla': { lat: 59.4144, lng: 17.8617 },
        'uppsala': { lat: 59.8586, lng: 17.6389 },
        'vallentuna': { lat: 59.5339, lng: 18.0775 },
        'vaxholm': { lat: 59.4019, lng: 18.3544 },
        'tullinge': { lat: 59.2000, lng: 17.9094 },
        'linköping': { lat: 58.4108, lng: 15.6214 },
        'norrköping': { lat: 58.5878, lng: 16.1928 },
        'mjölby': { lat: 58.3250, lng: 15.1278 },
        'motala': { lat: 58.5372, lng: 15.0356 },
        'västerås': { lat: 59.6099, lng: 16.5448 },
        'eskilstuna': { lat: 59.3711, lng: 16.5089 },
        'örebro': { lat: 59.2753, lng: 15.2134 },
        'östersund': { lat: 63.1792, lng: 14.6357 },
        'sundsvall': { lat: 62.3908, lng: 17.3069 },
        'umeå': { lat: 63.8258, lng: 20.2630 },
        'göteborg': { lat: 57.7089, lng: 11.9746 },
        'kungälv': { lat: 57.8706, lng: 11.9800 },
        'halmstad': { lat: 56.6745, lng: 12.8567 },
        'jönköping': { lat: 57.7826, lng: 14.1618 },
        'malmö': { lat: 55.6050, lng: 13.0038 },
        'helsingborg': { lat: 56.0465, lng: 12.6945 }
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
        alert('Plats ej hittad. Prova: Stockholm, Uppsala, Linköping, Göteborg, Östersund, Umeå, Jönköping');
    }
}

// Analyze locations based on criteria
async function analyzeLocations() {
    const criteria = {
        dataSource: document.getElementById('dataSource').value,
        businessType: document.getElementById('businessType').value,
        population: parseInt(document.getElementById('population').value),
        income: parseInt(document.getElementById('income').value),
        competition: document.getElementById('competition').value,
        trafficVolume: document.getElementById('trafficVolume').value,
        proximity: document.getElementById('proximity').value
    };

    // Show loading message
    const locationsList = document.getElementById('locationsList');
    locationsList.innerHTML = '<p style="text-align: center; padding: 40px; color: #667eea;">Loading data...</p>';

    let locationsToAnalyze = [];

    // Choose data source
    if (criteria.dataSource === 'scb' && typeof fetchRealLocations === 'function') {
        try {
            // Fetch real data from SCB
            console.log('Fetching real data from SCB...');
            locationsToAnalyze = await fetchRealLocations(mapCenter.lat, mapCenter.lng, 'SE', 5);
            
            if (locationsToAnalyze.length === 0) {
                alert('Kunde inte hämta data från SCB. Använder demo-data istället.\n\nOBS: SCB API kräver CORS-konfiguration för att fungera i webbläsaren.');
                locationsToAnalyze = generateSampleLocations(mapCenter.lat, mapCenter.lng, 15);
            }
        } catch (error) {
            console.error('SCB data fetch failed:', error);
            alert('Fel vid hämtning från SCB. Använder demo-data istället.');
            locationsToAnalyze = generateSampleLocations(mapCenter.lat, mapCenter.lng, 15);
        }
    } else if (criteria.dataSource === 'uscensus' && typeof fetchRealLocations === 'function') {
        try {
            // Fetch real data from US Census
            console.log('Fetching real data from US Census...');
            locationsToAnalyze = await fetchRealLocations(mapCenter.lat, mapCenter.lng, 'US', 5);
            
            if (locationsToAnalyze.length === 0) {
                alert('Could not fetch US Census data. Using demo data instead.\n\nNote: US Census API requires an API key.');
                locationsToAnalyze = generateSampleLocations(mapCenter.lat, mapCenter.lng, 15);
            }
        } catch (error) {
            console.error('US Census data fetch failed:', error);
            alert('Error fetching US Census data. Using demo data instead.');
            locationsToAnalyze = generateSampleLocations(mapCenter.lat, mapCenter.lng, 15);
        }
    } else {
        // Use demo data
        if (sampleLocations.length === 0) {
            sampleLocations = generateSampleLocations(mapCenter.lat, mapCenter.lng, 15);
        }
        locationsToAnalyze = sampleLocations;
    }

    // Calculate scores for all locations
    const analyzedLocations = locationsToAnalyze.map(location => ({
        ...location,
        score: calculateScore(location, criteria)
    }));

    // Update map and list
    addMarkersToMap(analyzedLocations);
    displayLocations(analyzedLocations);
}

// Parse CSV file
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });
            data.push(row);
        }
    }
    
    return data;
}

// Process competitor CSV data
function processCompetitorCSV(csvData) {
    const locations = [];
    
    csvData.forEach((row, index) => {
        try {
            const lat = parseFloat(row.lat || row.latitude || row['lat'] || row['latitude']);
            const lng = parseFloat(row.lng || row.lon || row.longitude || row['lng'] || row['lon'] || row['longitude']);
            
            if (!isNaN(lat) && !isNaN(lng)) {
                locations.push({
                    id: `comp-${index}`,
                    competitor: row.konkurrent || row.competitor || row.company || 'Okänd',
                    name: row.namn || row.name || row.location || `Lokation ${index + 1}`,
                    address: row.adress || row.address || '',
                    city: row.stad || row.city || row.ort || '',
                    lat: lat,
                    lng: lng
                });
            }
        } catch (error) {
            console.error(`Error processing row ${index}:`, error);
        }
    });
    
    return locations;
}

// Show competitors on map
function showCompetitors() {
    const competitorLocations = getCompetitorLocations();
    
    if (competitorLocations.length === 0) {
        alert('Inga konkurrentlokationer laddade. Ladda upp en CSV-fil först.');
        return;
    }
    
    // Clear existing markers
    markers = [];
    
    // Add competitor locations as markers with different colors per competitor
    const competitorColors = {};
    let colorIndex = 0;
    const colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#FF8B94', '#FED766'];
    
    competitorLocations.forEach(location => {
        // Assign color to competitor if not already assigned
        if (!competitorColors[location.competitor]) {
            competitorColors[location.competitor] = colors[colorIndex % colors.length];
            colorIndex++;
        }
        
        markers.push({
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            color: competitorColors[location.competitor],
            address: location.address,
            city: location.city,
            competitor: location.competitor,
            isCompetitor: true
        });
    });
    
    // Center map on Sweden
    mapCenter = { lat: 62.0, lng: 15.0 };
    mapZoom = 5;
    
    drawMap();
    
    // Display competitor locations in list
    const locationsList = document.getElementById('locationsList');
    
    // Group by competitor
    const grouped = {};
    competitorLocations.forEach(loc => {
        if (!grouped[loc.competitor]) {
            grouped[loc.competitor] = [];
        }
        grouped[loc.competitor].push(loc);
    });
    
    let html = `
        <div style="padding: 20px; background: #fff3cd; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #856404; margin-top: 0;">Konkurrentlokationer (${competitorLocations.length} st)</h3>
            <p>Visa alla konkurrentlokationer på kartan. Olika färger representerar olika konkurrenter.</p>
        </div>
    `;
    
    Object.keys(grouped).sort().forEach(competitor => {
        const locs = grouped[competitor];
        const color = competitorColors[competitor];
        
        html += `
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${color};">
                <h3 style="color: #333; margin-top: 0;">${competitor} (${locs.length} lokationer)</h3>
                ${locs.map(loc => `
                    <div class="location-card" style="border-left-color: ${color}; margin-bottom: 10px;">
                        <h4 style="margin-top: 0;">${loc.name}</h4>
                        <div class="location-details">
                            ${loc.address ? `<div class="detail-item" style="grid-column: 1 / -1;"><strong>Adress:</strong> ${loc.address}</div>` : ''}
                            ${loc.city ? `<div class="detail-item"><strong>Stad:</strong> ${loc.city}</div>` : ''}
                            <div class="detail-item"><strong>Koordinater:</strong> ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    locationsList.innerHTML = html;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    initMap();

    // Generate initial sample data (centered on Sweden)
    sampleLocations = generateSampleLocations(59.3293, 18.0686, 15); // Stockholm

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
    
    // K-Bygg locations button
    document.getElementById('showKbyggBtn').addEventListener('click', showKbyggLocations);
    
    // CSV Upload functionality
    const fileInput = document.getElementById('competitorFileInput');
    const uploadBtn = document.getElementById('uploadCompetitorBtn');
    const showCompetitorsBtn = document.getElementById('showCompetitorsBtn');
    const fileName = document.getElementById('fileName');
    const uploadStatus = document.getElementById('uploadStatus');
    
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        fileName.textContent = file.name;
        uploadStatus.style.display = 'none';
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const csvText = event.target.result;
                const csvData = parseCSV(csvText);
                const competitorLocations = processCompetitorCSV(csvData);
                
                if (competitorLocations.length === 0) {
                    uploadStatus.textContent = 'Inga giltiga lokationer hittades i filen. Kontrollera att CSV-filen har kolumnerna: Konkurrent, Namn, Adress, Stad, Lat, Lng';
                    uploadStatus.className = 'error';
                    uploadStatus.style.display = 'block';
                    showCompetitorsBtn.style.display = 'none';
                    return;
                }
                
                addCompetitorLocations(competitorLocations);
                
                uploadStatus.textContent = `✓ ${competitorLocations.length} konkurrentlokationer laddade!`;
                uploadStatus.className = 'success';
                uploadStatus.style.display = 'block';
                showCompetitorsBtn.style.display = 'block';
                
            } catch (error) {
                console.error('Error parsing CSV:', error);
                uploadStatus.textContent = 'Fel vid läsning av CSV-fil. Kontrollera filformatet.';
                uploadStatus.className = 'error';
                uploadStatus.style.display = 'block';
                showCompetitorsBtn.style.display = 'none';
            }
        };
        
        reader.onerror = function() {
            uploadStatus.textContent = 'Kunde inte läsa filen.';
            uploadStatus.className = 'error';
            uploadStatus.style.display = 'block';
            showCompetitorsBtn.style.display = 'none';
        };
        
        reader.readAsText(file);
    });
    
    showCompetitorsBtn.addEventListener('click', showCompetitors);

    // Initial display
    displayLocations([]);
});

// Show K-Bygg locations on map
function showKbyggLocations() {
    if (typeof KBYGG_LOCATIONS === 'undefined') {
        alert('K-Bygg data inte tillgänglig. Kontrollera att kbygg-data.js är laddad.');
        return;
    }
    
    // Clear existing markers
    markers = [];
    
    // Add K-Bygg locations as markers
    KBYGG_LOCATIONS.forEach(location => {
        markers.push({
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            color: '#667eea', // K-Bygg brand color
            address: location.address,
            region: location.region,
            isKbygg: true
        });
    });
    
    // Center map on Sweden
    mapCenter = { lat: 62.0, lng: 15.0 };
    mapZoom = 5;
    
    drawMap();
    
    // Display K-Bygg locations in list
    const locationsList = document.getElementById('locationsList');
    locationsList.innerHTML = `
        <div style="padding: 20px; background: #f0f9ff; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #667eea; margin-top: 0;">K-Bygg Anläggningar (${KBYGG_LOCATIONS.length} st)</h3>
            <p>Visa alla K-Bygg anläggningar på kartan. Klicka på markörerna för mer information.</p>
        </div>
        ${KBYGG_LOCATIONS.map((loc, idx) => `
            <div class="location-card" style="border-left-color: #667eea;">
                <h3>${loc.name}</h3>
                <div class="location-details">
                    <div class="detail-item" style="grid-column: 1 / -1;">
                        <strong>Adress:</strong> ${loc.address}
                    </div>
                    <div class="detail-item">
                        <strong>Region:</strong> ${loc.region}
                    </div>
                    <div class="detail-item">
                        <strong>Koordinater:</strong> ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}
                    </div>
                </div>
            </div>
        `).join('')}
    `;
}
