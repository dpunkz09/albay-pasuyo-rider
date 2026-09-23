# Manual Distance Feature

## Overview

Added a new "Manual Distance" page that allows users to directly input the distance to calculate delivery fees without using GPS or map.

## Use Cases

### When to use Manual Distance:
- **Pre-calculated distance**: User already knows the distance
- **Offline calculation**: No GPS available
- **Quick estimates**: Fast fee calculation without map interaction
- **Call center**: Operators calculating fees over phone
- **Repeat customers**: Known distances for regular deliveries

## Navigation

New navigation item added between "Calculator" and "Settings/Admin":

```
Calculator | Manual Distance | Settings/Admin
```

## Features

### 1. Simple Distance Input
- Single input field for distance in kilometers
- Number input with 0.1 km precision
- Auto-focus on page load
- Real-time validation

### 2. Instant Calculation
- Click "Calculate Fee" button
- Press Enter key to calculate
- Button disabled until valid distance entered

### 3. Fee Display
- Same result box as main calculator
- Shows breakdown: base fee + distance × rate
- Displays free distance info if applicable
- Smooth scroll to results

### 4. Validation
- Minimum: 0 km
- Maximum: Configured max range
- Decimal precision: 0.1 km
- Auto-validation as user types

### 5. Current Settings Display
- Shows base fee
- Shows rate per km
- Shows free distance
- Shows max range

## Technical Implementation

### Files Created
- `src/pages/manual.astro` - New manual distance page

### Files Modified
- `src/layouts/Layout.astro` - Added navigation item and activePage type

### Route
- **URL**: `/manual`
- **Active page marker**: `activePage="manual"`

### Code Structure

```typescript
// Settings loaded server-side
const s = getSettings();

// Client-side calculation
function computeFee(distance: number) {
  const billable = Math.max(0, distance - FREE_KM);
  return { fee: BASE_FEE + billable * FEE_PER_KM, billable };
}
```

## User Flow

```
User navigates to /manual
  ↓
Enters distance (e.g., 5.5 km)
  ↓
Clicks "Calculate Fee" OR presses Enter
  ↓
Fee calculated and displayed
  ↓
Breakdown shown:
  - Distance: 5.5 km
  - Base: ₱50
  - Additional: 4.5 km × ₱10/km = ₱45
  - Total: ₱95
```

## UI Components

### Input Card
- Material Icon: `straighten` (distance/ruler)
- Single numeric input field
- Helper text explaining usage
- Primary button for calculation

### Result Card (Gradient)
- Material Icon: `payments`
- Large fee display (₱XX)
- Two-line breakdown
- Smooth animation on display

### Config Card
- Shows current pricing configuration
- 4 key metrics in grid layout
- Icons for each metric
- Read-only display

## Keyboard Shortcuts

- **Tab**: Navigate to input field
- **Enter**: Calculate fee (when in input field)
- **Number keys**: Direct entry

## Validation Rules

| Rule | Behavior |
|------|----------|
| Empty input | Button disabled |
| Negative number | Button disabled |
| Non-numeric | Button disabled |
| 0 km | Valid, calculates base fee only |
| Above max range | Shows error alert |
| Valid distance | Button enabled, calculation works |

## Error Handling

### Out of Range
```html
<Alert variant="error">
  Sorry, this distance is outside our service range.
</Alert>
```

### Invalid Input
- Button stays disabled
- No error message (graceful)
- Input accepts only valid numbers

## Responsive Design

### Desktop
- Centered layout (max-width: 5xl)
- 2-column grid for config
- Comfortable padding

### Mobile
- Full-width cards
- Single column layout
- Touch-friendly buttons
- Auto-focused input

## Comparison with Main Calculator

| Feature | Main Calculator | Manual Distance |
|---------|----------------|-----------------|
| Location input | GPS + Map | None |
| Distance input | Automatic | Manual |
| Map display | Yes | No |
| Road routing | OSRM API | N/A |
| Complexity | High | Low |
| Speed | Slow (API) | Instant |
| Accuracy | Road distance | User-provided |
| Use case | Precise | Quick estimate |

## Future Enhancements

1. **Distance presets**: Quick buttons for common distances
2. **History**: Save recent calculations
3. **Multiple fees**: Calculate for different distances at once
4. **Export**: Share or print fee quotes
5. **Distance suggestions**: Based on location names

## Benefits

### User Benefits
✅ **Speed**: Instant calculation without GPS/map
✅ **Simplicity**: Single input field
✅ **Convenience**: For known distances
✅ **Offline**: Works without location services

### Business Benefits
✅ **Call center ready**: Phone-based quotes
✅ **Flexibility**: Multiple calculation methods
✅ **Accessibility**: No GPS required
✅ **Quick estimates**: Pre-delivery quotes

## Analytics Opportunities

Track usage patterns:
- Distance ranges entered
- Average distances
- Peak usage times
- Conversion to actual orders
