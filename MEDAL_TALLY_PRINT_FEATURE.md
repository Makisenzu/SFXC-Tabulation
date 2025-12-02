# Medal Tally Print Feature

## Overview
This feature allows administrators to print medal tally reports in two formats:
1. **Full Medal Tally** - Complete overview with standings and detailed results
2. **Cue Cards** - Individual cards per event for announcements

## Features

### 1. Full Medal Tally Print
- **Format**: A4 Landscape
- **Contents**:
  - Overall medal standings with rankings
  - Medal counts (Gold, Silver, Bronze) per participant
  - Detailed competition results table
  - Participant color coding (CBE: Yellow, CTE: Blue, CCJE: Red)
  
- **Usage**:
  - Navigate to Admin → Medal Tally Management
  - Click "View & Edit Scores" on any medal tally
  - Click "Full Tally" button with printer icon
  - A new window opens with the print preview
  - Click "Print This Report" or use Ctrl+P

### 2. Cue Cards Print
- **Format**: A4 Portrait (One card per page)
- **Contents**:
  - **Event Name** - Large, prominent title
  - **2nd Place** - Bronze medal winner (🥉)
  - **1st Place** - Silver medal winner (🥈)
  - **Champion** - Gold medal winner (🥇)
  - **Overall Medal Summary** - Complete gold, silver, bronze count for ALL participants
  - Perfect for announcements and ceremonies

- **Layout**:
  ```
  [Event Name]
  
  2nd Place: _______________
  1st Place: _______________
  Champion:  _______________
  
  OVERALL MEDAL SUMMARY
  - Participant 1: 🥇 X  🥈 Y  🥉 Z  Total: N
  - Participant 2: 🥇 X  🥈 Y  🥉 Z  Total: N
  - Participant 3: 🥇 X  🥈 Y  🥉 Z  Total: N
  ```

- **Usage**:
  - Navigate to Admin → Medal Tally Management
  - Click "View & Edit Scores" on any medal tally
  - Click "Cue Cards" button with printer icon
  - A new window opens with all cue cards
  - Click "Print Cue Cards" or use Ctrl+P

## Ranking System
Rankings are based on:
1. **Gold medals** (primary criterion)
2. **Silver medals** (tiebreaker)
3. **Bronze medals** (final tiebreaker)

This follows the standard Olympic ranking system.

## Technical Details

### New Routes
- `GET /printFullMedalTally/{id}` - Full tally print view
- `GET /printCueCards/{id}` - Cue cards print view

### New Components
- `PrintFullMedalTally.jsx` - Full tally print component
- `PrintCueCards.jsx` - Cue cards print component

### Controller Methods
- `MedalController@printFullTally` - Renders full tally
- `MedalController@printCueCards` - Renders cue cards

## Print Styling
- Optimized for printing with proper page breaks
- No-print elements hidden during printing
- Responsive design for screen preview
- Auto-trigger print dialog on page load

## Browser Compatibility
Works with all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Tips
- Use "Print Preview" in your browser to check before printing
- Adjust printer settings for best quality
- For cue cards, ensure "Print backgrounds" is enabled for colored borders
- Use landscape orientation for full tally reports
- Use portrait orientation for cue cards
