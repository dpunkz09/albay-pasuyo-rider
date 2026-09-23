# Logo Setup Instructions

## Save Your Logo

The UI has been updated to use your Albay Pasuyo Rider logo. To complete the setup:

1. Save your logo image (the circular yellow badge with rider) as:
   ```
   public/logo.png
   ```

2. The logo should be:
   - Format: PNG with transparency (or JPG)
   - Recommended size: 200x200px or larger (square aspect ratio)
   - The navigation will display it as a 40x40px rounded circle

## Alternative: Use SVG

If you have an SVG version of the logo, you can:
1. Save it as `public/logo.svg`
2. Update the Layout.astro navigation to use `.svg` instead of `.png`:
   ```html
   <img src="/logo.svg" alt="Albay Pasuyo Rider" class="h-10 w-10 rounded-full object-cover" />
   ```

## Current Design Changes

✅ Replaced all emojis with Google Material Icons
✅ Modern minimalistic white navigation bar
✅ Cleaner spacing and typography (Inter font)
✅ Enhanced cards with icon headers
✅ Improved button layouts with icons + text
✅ Better map styling with rounded corners
✅ Modernized login page with centered card
✅ Updated all alerts with Material Icons

## Colors Reference

The design uses your logo's color scheme:
- Orange/Store marker: `#f97316`
- Blue/User marker: `#2563eb`
- Primary brand color from your design system
