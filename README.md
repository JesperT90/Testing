# Business Location Finder 🏢

A web application that helps you find good locations for expanding your business. This tool analyzes potential locations based on multiple criteria including population, income levels, competition, traffic, and proximity to transportation.

## Features

- 🗺️ **Interactive Map**: Visualize potential business locations on an interactive map
- 📊 **Location Analysis**: Score locations based on customizable business criteria
- 🎯 **Smart Scoring**: Algorithmic evaluation of locations based on multiple factors
- 🔍 **Location Search**: Search for any city or address worldwide
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Visual Indicators**: Color-coded markers and scores for quick assessment

## How to Use

1. **Open the Application**: Open `index.html` in a web browser
2. **Search for a Location**: Use the search bar to find a specific city or area
3. **Set Your Criteria**: Adjust the business criteria according to your needs:
   - Business Type (Retail, Restaurant, Office, Warehouse, Service)
   - Minimum Population
   - Minimum Average Income
   - Competition Level
   - Traffic Volume
   - Proximity to Transportation
4. **Analyze**: Click the "Analyze Locations" button to see scored locations
5. **Review Results**: View locations on the map and in the list, sorted by score

## Scoring System

Locations are scored out of 100 points based on:

- **Population** (20 points): Higher population increases score
- **Income** (20 points): Higher average income increases score
- **Competition** (20 points): Lower competition is preferred
- **Traffic** (20 points): Higher traffic volume is preferred
- **Proximity** (20 points): Closer to transportation is preferred

### Score Categories

- 🟢 **Excellent** (80-100): Ideal locations for expansion
- 🔵 **Good** (60-79): Strong potential locations
- 🟠 **Fair** (40-59): Moderate potential, consider carefully
- 🔴 **Poor** (0-39): Not recommended

## Technology Stack

- **HTML5**: Structure and content
- **CSS3**: Styling and responsive design
- **JavaScript**: Application logic and interactivity
- **Leaflet.js**: Interactive mapping functionality
- **OpenStreetMap**: Map tiles and geocoding

## Getting Started

Simply open `index.html` in any modern web browser. No installation or build process required!

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Use a simple HTTP server
python -m http.server 8000
# Then visit http://localhost:8000
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Demo Data

The application generates sample location data for demonstration purposes. In a production environment, this would be connected to real demographic and business data APIs.

## Future Enhancements

- Integration with real demographic data APIs
- Historical business success data
- Competitor analysis
- Cost analysis and ROI projections
- Export reports functionality
- Save and compare locations
- User accounts and preferences

## License

MIT License - Feel free to use and modify for your business needs.
