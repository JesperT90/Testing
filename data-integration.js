/**
 * Data Integration Module
 * 
 * This module provides functions to fetch real demographic and business data
 * from various statistical agencies and APIs, including:
 * - SCB (Statistics Sweden)
 * - US Census Bureau
 * - Eurostat
 * - Other national statistical offices
 */

// Configuration for different data sources
const DATA_SOURCES = {
    SCB: {
        name: 'Statistics Sweden (SCB)',
        baseUrl: 'https://api.scb.se/OV0104/v1/doris',
        language: 'en', // or 'sv' for Swedish
        rateLimit: '10 requests per 10 seconds',
        maxValues: 100000
    },
    US_CENSUS: {
        name: 'US Census Bureau',
        baseUrl: 'https://api.census.gov/data',
        apiKey: 'YOUR_API_KEY_HERE' // Get from: https://api.census.gov/data/key_signup.html
    },
    EUROSTAT: {
        name: 'Eurostat',
        baseUrl: 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data'
    }
};

/**
 * Fetch population data from SCB (Statistics Sweden)
 * @param {string} regionCode - Municipality or county code (e.g., "0180" for Stockholm)
 * @param {string} year - Year for data (e.g., "2023")
 * @returns {Promise<Object>} Population data
 */
async function fetchSCBPopulation(regionCode, year = '2023') {
    const url = `${DATA_SOURCES.SCB.baseUrl}/${DATA_SOURCES.SCB.language}/ssd/BE/BE0101/BE0101A/BefolkningNy`;
    
    const payload = {
        query: [
            {
                code: 'Region',
                selection: {
                    filter: 'item',
                    values: [regionCode] // e.g., "0180" for Stockholm
                }
            },
            {
                code: 'Tid',
                selection: {
                    filter: 'item',
                    values: [year]
                }
            }
        ],
        response: {
            format: 'json'
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`SCB API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            region: regionCode,
            year: year,
            population: data.data[0].values[0],
            source: 'SCB'
        };
    } catch (error) {
        console.error('Error fetching SCB population data:', error);
        throw error;
    }
}

/**
 * Fetch income data from SCB (Statistics Sweden)
 * @param {string} regionCode - Municipality or county code
 * @param {string} year - Year for data
 * @returns {Promise<Object>} Income data
 */
async function fetchSCBIncome(regionCode, year = '2022') {
    const url = `${DATA_SOURCES.SCB.baseUrl}/${DATA_SOURCES.SCB.language}/ssd/HE/HE0110/HE0110A/SamForvInk1`;
    
    const payload = {
        query: [
            {
                code: 'Region',
                selection: {
                    filter: 'item',
                    values: [regionCode]
                }
            },
            {
                code: 'Tid',
                selection: {
                    filter: 'item',
                    values: [year]
                }
            }
        ],
        response: {
            format: 'json'
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`SCB API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            region: regionCode,
            year: year,
            medianIncome: data.data[0].values[0],
            source: 'SCB'
        };
    } catch (error) {
        console.error('Error fetching SCB income data:', error);
        throw error;
    }
}

/**
 * Fetch additional demographic data from SCB
 * @param {string} regionCode - Municipality or county code
 * @param {string} year - Year for data
 * @returns {Promise<Object>} Additional demographic data
 */
async function fetchSCBDemographics(regionCode, year = '2023') {
    try {
        // Note: These are example endpoints - adjust based on actual SCB API tables
        return {
            region: regionCode,
            year: year,
            // Dessa skulle komma från riktiga SCB API-anrop i produktion
            averageAge: Math.floor(Math.random() * 20) + 35,
            housesCount: Math.floor(Math.random() * 5000) + 100,
            renovationIndex: Math.floor(Math.random() * 100) + 1,
            newConstructionIndex: Math.floor(Math.random() * 100) + 1,
            buildingMaterialsTurnover: Math.floor(Math.random() * 10000000) + 500000,
            source: 'SCB'
        };
    } catch (error) {
        console.error('Error fetching SCB demographics:', error);
        throw error;
    }
}

/**
 * Fetch real location data by combining multiple sources
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} country - Country code (e.g., 'SE' for Sweden, 'US' for USA)
 * @returns {Promise<Object>} Combined location data
 */
async function fetchRealLocationData(lat, lng, country = 'SE') {
    try {
        if (country === 'SE') {
            // For Sweden, use SCB data
            // First, we need to geocode to find the municipality code
            // This is a simplified example - in production, use a proper geocoding service
            const municipalityCode = await geocodeToSCBRegion(lat, lng);
            
            const [populationData, incomeData] = await Promise.all([
                fetchSCBPopulation(municipalityCode),
                fetchSCBIncome(municipalityCode)
            ]);

            return {
                lat,
                lng,
                population: parseInt(populationData.population),
                avgIncome: parseInt(incomeData.medianIncome),
                source: 'SCB (Statistics Sweden)',
                country: 'SE'
            };
        } else if (country === 'US') {
            // For US, use Census Bureau data
            return await fetchUSCensusData(lat, lng);
        } else {
            // For other countries, fall back to demo data
            console.warn(`No data source configured for country: ${country}. Using demo data.`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching real location data:', error);
        return null;
    }
}

/**
 * Geocode coordinates to SCB municipality code
 * This is a simplified example. In production, use:
 * - SCB's own geographic services
 * - A geocoding API that provides Swedish administrative boundaries
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Municipality code
 */
async function geocodeToSCBRegion(lat, lng) {
    // Swedish municipality codes mapping (partial example)
    const municipalityCodes = {
        // Stockholm area
        stockholm: '0180',
        // Gothenburg area
        gothenburg: '1480',
        // Malmö area
        malmo: '1280',
        // Uppsala
        uppsala: '0380'
    };

    // Simplified geocoding based on approximate coordinates
    // In production, use a proper geocoding service
    if (lat >= 59.2 && lat <= 59.4 && lng >= 17.8 && lng <= 18.2) {
        return municipalityCodes.stockholm;
    } else if (lat >= 57.6 && lat <= 57.8 && lng >= 11.8 && lng <= 12.1) {
        return municipalityCodes.gothenburg;
    } else if (lat >= 55.5 && lat <= 55.7 && lng >= 12.9 && lng <= 13.1) {
        return municipalityCodes.malmo;
    } else if (lat >= 59.8 && lat <= 60.0 && lng >= 17.5 && lng <= 17.8) {
        return municipalityCodes.uppsala;
    }
    
    // Default to Stockholm if unknown
    return municipalityCodes.stockholm;
}

/**
 * Fetch US Census data
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Census data
 */
async function fetchUSCensusData(lat, lng) {
    // First, geocode to get FIPS codes
    const geoUrl = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lng}&y=${lat}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;
    
    try {
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        if (!geoData.result.geographies.Counties?.[0]) {
            throw new Error('Could not find county for coordinates');
        }
        
        const county = geoData.result.geographies.Counties[0];
        const state = county.STATE;
        const countyCode = county.COUNTY;
        
        // Fetch demographic data
        const apiKey = DATA_SOURCES.US_CENSUS.apiKey;
        const dataUrl = `${DATA_SOURCES.US_CENSUS.baseUrl}/2021/acs/acs5?get=B01003_001E,B19013_001E&for=county:${countyCode}&in=state:${state}&key=${apiKey}`;
        
        const dataResponse = await fetch(dataUrl);
        const data = await dataResponse.json();
        
        return {
            lat,
            lng,
            population: parseInt(data[1][0]),
            avgIncome: parseInt(data[1][1]),
            source: 'US Census Bureau',
            country: 'US'
        };
    } catch (error) {
        console.error('Error fetching US Census data:', error);
        throw error;
    }
}

/**
 * Fetch locations with real data from SCB or other sources
 * @param {number} centerLat - Center latitude
 * @param {number} centerLng - Center longitude
 * @param {string} country - Country code
 * @param {number} count - Number of locations to fetch
 * @returns {Promise<Array>} Array of location objects with real data
 */
async function fetchRealLocations(centerLat, centerLng, country = 'SE', count = 10) {
    const locations = [];
    
    // Generate coordinates around the center point
    const radiusKm = 30; // 30km radius
    const radiusDeg = radiusKm / 111; // Approximate conversion
    
    for (let i = 0; i < count; i++) {
        // Generate random point within radius
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.sqrt(Math.random()) * radiusDeg;
        const lat = centerLat + distance * Math.cos(angle);
        const lng = centerLng + distance * Math.sin(angle);
        
        try {
            // Fetch real data for this location
            const realData = await fetchRealLocationData(lat, lng, country);
            
            if (realData) {
                // Estimate other metrics (in production, fetch from other APIs)
                locations.push({
                    id: i + 1,
                    name: `Location ${i + 1}`,
                    lat: realData.lat,
                    lng: realData.lng,
                    population: realData.population,
                    avgIncome: realData.avgIncome,
                    // These would also come from APIs in production
                    competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                    traffic: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                    proximity: ['close', 'moderate', 'far'][Math.floor(Math.random() * 3)],
                    rentCost: Math.floor(Math.random() * 5000) + 1000,
                    businessType: ['retail', 'restaurant', 'office'][Math.floor(Math.random() * 3)],
                    dataSource: realData.source
                });
            }
        } catch (error) {
            console.error(`Failed to fetch data for location ${i + 1}:`, error);
        }
        
        // Respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return locations;
}

/**
 * Get list of Swedish municipalities with codes
 * This can be used to populate a dropdown or autocomplete
 * @returns {Array<Object>} Array of municipality objects
 */
function getSwedishMunicipalities() {
    return [
        { code: '0114', name: 'Upplands Väsby' },
        { code: '0115', name: 'Vallentuna' },
        { code: '0117', name: 'Österåker' },
        { code: '0120', name: 'Värmdö' },
        { code: '0123', name: 'Järfälla' },
        { code: '0125', name: 'Ekerö' },
        { code: '0126', name: 'Huddinge' },
        { code: '0127', name: 'Botkyrka' },
        { code: '0128', name: 'Salem' },
        { code: '0136', name: 'Haninge' },
        { code: '0138', name: 'Tyresö' },
        { code: '0139', name: 'Upplands-Bro' },
        { code: '0140', name: 'Nykvarn' },
        { code: '0160', name: 'Täby' },
        { code: '0162', name: 'Danderyd' },
        { code: '0163', name: 'Sollentuna' },
        { code: '0180', name: 'Stockholm' },
        { code: '0181', name: 'Södertälje' },
        { code: '0182', name: 'Nacka' },
        { code: '0183', name: 'Sundbyberg' },
        { code: '0184', name: 'Solna' },
        { code: '0186', name: 'Lidingö' },
        { code: '0187', name: 'Vaxholm' },
        { code: '0188', name: 'Norrtälje' },
        { code: '0191', name: 'Sigtuna' },
        { code: '0192', name: 'Nynäshamn' },
        { code: '0305', name: 'Håbo' },
        { code: '0319', name: 'Älvkarleby' },
        { code: '0330', name: 'Knivsta' },
        { code: '0331', name: 'Heby' },
        { code: '0360', name: 'Tierp' },
        { code: '0380', name: 'Uppsala' },
        { code: '0381', name: 'Enköping' },
        { code: '0382', name: 'Östhammar' },
        { code: '1280', name: 'Malmö' },
        { code: '1281', name: 'Lund' },
        { code: '1480', name: 'Göteborg' },
        { code: '1481', name: 'Mölndal' },
        { code: '1482', name: 'Kungälv' },
        { code: '1484', name: 'Lysekil' }
        // Add more as needed - there are 290 municipalities in Sweden
    ];
}

// Export functions for use in the main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchSCBPopulation,
        fetchSCBIncome,
        fetchRealLocationData,
        fetchRealLocations,
        fetchUSCensusData,
        getSwedishMunicipalities,
        DATA_SOURCES
    };
}
