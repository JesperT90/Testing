# Business Location Finder - Quick Start Guide

## Getting Started

1. **Open the Application**
   - Simply open `index.html` in any modern web browser
   - No installation or setup required!

2. **Search for a Location** (Optional)
   - Enter a city name in the search bar (e.g., "New York", "San Francisco", "London")
   - Click "Search" to center the map on that location
   - Supported cities: San Francisco, New York, Los Angeles, Chicago, Houston, London, Paris, Tokyo, Sydney, Toronto

3. **Set Your Business Criteria**
   - **Business Type**: Choose your business category (Retail, Restaurant, Office, Warehouse, Service)
   - **Min Population**: Set the minimum population requirement for the area
   - **Min Avg Income**: Set the minimum average income level ($)
   - **Competition Level**: Specify preferred competition level (Low/Medium/High)
   - **Traffic Volume**: Set preferred foot/vehicle traffic (High/Medium/Low)
   - **Proximity to Transport**: Set preferred distance to transportation hubs

4. **Analyze Locations**
   - Click the "Analyze Locations" button
   - The map will display color-coded markers for each location
   - The list will show detailed information sorted by score

5. **Review Results**
   - **Green markers** = Excellent locations (80-100 points)
   - **Blue markers** = Good locations (60-79 points)
   - **Orange markers** = Fair locations (40-59 points)
   - **Red markers** = Poor locations (0-39 points)

6. **Interact with the Map**
   - **Drag** to pan around the map
   - **Scroll** to zoom in/out
   - **Click markers** to see location details

## Understanding the Scoring System

Each location is scored out of 100 points based on:

- **Population (20 pts)**: Higher population = higher score
- **Average Income (20 pts)**: Higher income = higher score
- **Competition (20 pts)**: Matches your preference (low/medium/high)
- **Traffic Volume (20 pts)**: Matches your preference (high/medium/low)
- **Proximity to Transport (20 pts)**: Matches your preference (close/moderate/far)

## Tips for Best Results

1. **For Retail/Restaurant**: Look for high traffic, good income, and low-medium competition
2. **For Office**: Focus on proximity to transport and moderate-high income areas
3. **For Warehouse**: Consider low rent areas with good transport access
4. **For Service Business**: Balance between population density and competition level

## Example Use Cases

### Opening a Coffee Shop
- Business Type: Restaurant
- Min Population: 25,000
- Min Avg Income: $45,000
- Competition: Low to Medium
- Traffic: High
- Transport: Close

### Opening a Tech Office
- Business Type: Office
- Min Population: 50,000
- Min Avg Income: $70,000
- Competition: Medium
- Traffic: Medium
- Transport: Close

### Opening a Distribution Center
- Business Type: Warehouse
- Min Population: 10,000
- Min Avg Income: $35,000
- Competition: Low
- Traffic: Low to Medium
- Transport: Close

## Notes

- **This is a demonstration tool using randomly generated sample data**
- The data is created client-side and changes each time you search or analyze
- For production use, integrate with real data APIs:
  - US Census Bureau (demographics)
  - Google Places/Maps (business density, traffic)
  - Zillow/Redfin (real estate costs)
  - Local government open data portals
- In production, connect to real demographic and business data APIs
- The scoring algorithm can be customized based on specific business needs
- Always conduct additional research before making final location decisions

## Browser Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Canvas support (standard in all modern browsers)
- No internet connection required after initial load

## Troubleshooting

**Map not displaying?**
- Ensure JavaScript is enabled in your browser
- Try refreshing the page
- Check browser console for errors

**Search not working?**
- Try one of the supported cities listed above
- The search uses a predefined list of major cities

**Locations not showing?**
- Click the "Analyze Locations" button after setting criteria
- Make sure criteria are not too restrictive

## Support

For issues or questions, please refer to the README.md file or create an issue in the repository.
