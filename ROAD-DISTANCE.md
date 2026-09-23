# Road Distance Calculation

## Overview

The app now calculates **actual road distances** instead of straight-line (as-the-crow-flies) distances using the OSRM (Open Source Routing Machine) routing API.

## How It Works

1. **Routing API**: Uses the free OSRM public API at `router.project-osrm.org`
2. **Real Road Network**: Calculates driving distance following actual roads from OpenStreetMap
3. **Visual Route**: Displays the actual driving route on the map as a blue line
4. **Fallback**: If the API fails or is unavailable, falls back to straight-line distance calculation

## Features

✅ **Accurate Distances**: Real road distances instead of straight-line
✅ **Route Visualization**: Shows the actual driving path on the map
✅ **Loading State**: Displays "Calculating..." while fetching route
✅ **Error Handling**: Gracefully falls back to straight-line if API unavailable
✅ **Performance**: Async calculation doesn't block the UI

## API Details

- **Service**: OSRM (Open Source Routing Machine)
- **Endpoint**: `https://router.project-osrm.org/route/v1/driving/`
- **Cost**: Free (public instance)
- **Rate Limits**: Fair use policy applies
- **Fallback**: Haversine formula for straight-line distance

## Distance Display

The distance indicator now shows:
- 🔵 **Route icon** (instead of straighten) 
- **Road distance** in kilometers
- Updates in real-time when markers are moved

## Future Enhancements

Consider these improvements for production:

1. **Self-hosted OSRM**: For unlimited requests and better reliability
2. **Alternative APIs**: OpenRouteService, Google Directions, Mapbox
3. **Multiple Route Options**: Fastest vs shortest route
4. **Traffic Data**: Real-time traffic-adjusted distances
5. **Caching**: Cache common routes to reduce API calls

## Technical Notes

- Route geometry is in GeoJSON format `[lng, lat]`
- Leaflet uses `[lat, lng]` so coordinates are converted
- Distance returned in meters, converted to kilometers
- Route is drawn with blue solid line when API succeeds
- Dashed line fallback when using straight-line calculation
