# HEIGHTS — Human scale. Extraordinary heights.

An interactive, vertically scroll-driven height comparison experience inspired by the sense of vertical discovery in *The Deep Sea* (Neal.fun), engineered with **A-Frame 1.8.0**, React 19, Tailwind CSS, and vector SVG silhouette rendering.

Visualizes the height of an average adult human (1.70 m / 5.58 ft) against 28 famous structures, animals, prehistoric life, landmarks, supertall and megatall skyscrapers, Earth's natural peaks, Martian shield volcanoes, and the cosmic boundary of space.

---

## 1. Architectural Overview

The application is structured into decoupled, modular systems:

1. **3D Visualization Layer (`src/components/AFrameScene.tsx`)**:
   - Built on **A-Frame 1.8.0** / Three.js.
   - Utilizes orthographic-aligned camera framing to avoid perspective foreshortening distortion when comparing heights.
   - Registers custom A-Frame components (`human-reference`, `comparison-object`, `height-scale`, `object-label`, `scene-transition`, `scroll-controller`).
   - Renders 3D laser elevation ticks, ground baseline, and dynamic canvas-backed silhouette textures.

2. **Fixed Human Reference (`src/components/HumanReference.tsx`)**:
   - Pinned in screen-space at the bottom-left of the viewport.
   - Represents the canonical 1.70 m adult human.
   - Remains stationary across all comparisons, never distorting or shrinking.
   - Accompanied by real-time metric/imperial readouts and baseline indicators.

3. **High-Precision Silhouette Stage (`src/components/SilhouetteViewer.tsx`)**:
   - Mathematical scale comparison renderer.
   - Projects both human and comparative silhouettes onto a shared ground baseline (0.0 m).
   - Dynamically calculates the human-to-object ratio (`≈ X × THE HUMAN`).

4. **Elevation Navigation & Telemetry (`src/components/TopNav.tsx` & `src/components/ScaleRuler.tsx`)**:
   - Real-time altitude telemetry, atmospheric strata tracking (Troposphere, Stratosphere, Mesosphere, Thermosphere / Kármán Line).
   - Metric (`M`) and Imperial (`FT`) dual-unit toggle.
   - Mode switcher: *Comparative Lens* vs *1:1 Climb Mode*.
   - Searchable, filterable 28-object catalog directory.

---

## 2. Measurement Assumptions & Scientific Standards

All 28 comparison entries are verified using authoritative international registries:

- **Human Reference (1.70 m)**: ISO 7250 / WHO global adult reference datum.
- **Basketball Hoop (3.05 m)**: FIBA / NBA official rim height above playing floor (10 ft 0 in).
- **African Bush Elephant (3.50 m)**: Bull shoulder height datum (Smithsonian / IUCN).
- **Tyrannosaurus Rex (3.96 m)**: Reconstructed hip height (AMNH 5027 / Field Museum FMNH PR 2081).
- **London Bus (4.38 m)**: TfL AEC Routemaster road clearance.
- **Giraffe (5.50 m)**: Adult male standing height to ossicones (Giraffe Conservation Foundation).
- **Bus Stack of 5 (21.90 m)**: Hypothetical vertical thought experiment (5 × 4.38 m).
- **Blue Whale (29.90 m)**: Maximum verified scientific length oriented vertically (NOAA Fisheries).
- **Christ the Redeemer (38.00 m)**: Total height including 8 m pedestal (UNESCO World Heritage).
- **Leaning Tower of Pisa (56.67 m)**: High-side ground-to-belfry elevation (Opera della Primaziale Pisana).
- **General Sherman (83.80 m)**: Base-to-crown apex height (U.S. National Park Service).
- **Statue of Liberty (93.00 m)**: Ground foundation to torch flame (46 m copper figure + 47 m pedestal; U.S. NPS).
- **Big Ben / Elizabeth Tower (96.30 m)**: Street-to-finial spire height (UK Parliament Archives).
- **Saturn V Rocket (110.60 m)**: Liftoff launch configuration including launch escape tower (NASA).
- **Great Pyramid of Giza (138.80 m)**: Current eroded height (originally 146.6 m; Harvard Giza Project).
- **Washington Monument (169.29 m)**: Ground to aluminum apex tip (U.S. National Park Service).
- **Statue of Unity (182.00 m)**: Statue figure alone; 240 m with plinth (Government of Gujarat).
- **Gateway Arch (192.00 m)**: Weighted catenary apex height and span (U.S. National Park Service).
- **Eiffel Tower (330.00 m)**: Including March 2022 radio antenna installation; 300 m architectural framework (SETE).
- **Empire State Building (443.20 m)**: Pinnacle broadcast spire; 381.0 m roof height (CTBUH).
- **Petronas Twin Towers (451.90 m)**: Architectural spire tip (CTBUH Skyscraper Center).
- **Taipei 101 (508.00 m)**: Architectural spire tip (CTBUH Skyscraper Center).
- **Shanghai Tower (632.00 m)**: Architectural crown height (CTBUH Skyscraper Center).
- **Burj Khalifa (828.00 m)**: Architectural pinnacle spire (Emaar / CTBUH Skyscraper Center).
- **Mount Everest (8,848.86 m)**: Elevation above mean sea level (Nepal/China joint survey 2020).
- **Mauna Kea (10,203.00 m)**: Total vertical relief from Pacific abyssal ocean floor base to summit (USGS).
- **Olympus Mons (21,900.00 m)**: Relief above surrounding Martian lava plains (NASA JPL MOLA).
- **Kármán Line (100,000.00 m)**: Atmospheric boundary of outer space (FAI Astronautic Records).

---

## 3. How to Add New Comparison Objects

To add a new comparison object, append an entry to the `HEIGHT_ITEMS` array in `src/data/heightData.ts`:

```typescript
{
  id: 'my-new-landmark',
  name: 'Empire Landmark',
  category: 'Modern Engineering',
  heightMeters: 250.00,
  heightDefinition: 'Clear description of what is included (e.g. spire, pedestal, sea level).',
  description: 'Editorial documentary text explaining architectural significance.',
  location: 'City, Country',
  elevationNotes: 'Additional datum context.',
  sourceName: 'Official Registry / Authoritative Body',
  sourceUrl: 'https://official-registry.example.org',
  accentColor: '#38bdf8',
  viewBox: '0 0 100 250',
  aspectRatio: 100 / 250,
  svgPath: 'M ... Z', // Crisp vector SVG path
  svgDetails: 'M ...', // Optional fine lines / windows
  featuredFact: 'Interesting mathematical or historical fact.'
}
```

The system automatically:
1. Calculates the exact ratio: `heightMeters / 1.70`.
2. Computes metric and imperial conversions.
3. Assigns the appropriate atmospheric layer.
4. Generates the 3D billboard texture in A-Frame.
5. Populates the interactive directory and bottom scrubber.

---

## 4. Setup and Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Run the local development server on port 3000
npm run dev

# Build production bundle
npm run build
```

---

## 5. Keyboard & Interaction Controls

- **Mouse Wheel / Trackpad**: Scroll up/down to ascend or descend through scale.
- **Keyboard Arrow Down / Right / PageDown**: Step to the next taller object.
- **Keyboard Arrow Up / Left / PageUp**: Step to the previous object.
- **Home / End**: Jump to human origin (1.70 m) or the Kármán line (100 km).
- **Top Nav Toggle `M / FT`**: Switch between Metric and Imperial units.
- **Top Nav `1:1 Climb Mode / Comparative Lens`**: Toggle viewing modes.
- **Directory**: Open the full searchable catalog of all 28 comparisons.
