# Mythic Media

A web app that automatically generates thumbnails from World of Warcraft characters' recent Mythic+ dungeon runs.

## What It Does

Mythic Media allows you to:
- **Generate Thumbnails**: Input a character name, realm, and region to automatically create a thumbnail featuring:
  - The character's 3D render from Blizzard's API
  - The most recent Mythic+ dungeon run background
  - Mythic+ level with a vibrant gradient effect
  - Dungeon name in gold text
  - Character class and specialization with class-specific colors
- **Download Thumbnails**: Instantly download your generated thumbnail as a PNG file

## Tech Used

### Frontend
- **Next.js** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Fonts** - Expressway font for thumbnail text

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Canvas API** - Server-side image generation and manipulation

### External APIs
- **Raider.IO API** - Fetches character Mythic+ data and dungeon backgrounds
- **Blizzard API** - Retrieves character renders and media assets

## Features

- **Automatic Thumbnail Generation**: Creates 1280x720px thumbnails optimized for YouTube
- **Class Color Coding**: Each WoW class has its signature color (e.g., Death Knight red, Mage blue)
- **Dynamic Character Renders**: Fetches high-quality 3D character renders from Blizzard
- **Dungeon Backgrounds**: Uses the actual dungeon background from the Mythic+ run
- **Multi-Region Support**: Supports US, EU, KR, and TW regions

## Prerequisites

- Node.js 20+ 
- npm or yarn
- Blizzard API credentials (Client ID and Secret)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lancebailey26/mythic-media.git
   cd mythic-media
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   BLIZZARD_CLIENT_ID=your_blizzard_client_id
   BLIZZARD_CLIENT_SECRET=your_blizzard_client_secret
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
mythic-media/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generateThumbnail/  # Main thumbnail generation endpoint
│   │   │   ├── getRecentRun/      # Fetches character Mythic+ data
│   │   │   └── uploadVideo/       # Video upload endpoint
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── upload/                # Upload page - wip/abandoned
│   ├── components/
│   │   ├── nav.tsx                # Navigation component
│   │   └── thumbnailForm.tsx     # Character input form
│   └── fonts/
│       └── expressway.ttf        # Custom font for thumbnails
├── styles/
│   └── globals.css                # Global styles
└── tailwind.config.js            # Tailwind configuration
```

## How It Works

1. **User Input**: User enters character name, realm, and selects region
2. **Data Fetching**: 
   - Fetches character data and recent Mythic+ runs from Raider.IO
   - Retrieves character render from Blizzard API (requires OAuth token)
   - Gets dungeon background image from the run data
3. **Image Generation**:
   - Creates a 1280x720px canvas
   - Layers the dungeon background
   - Overlays the character render (zoomed and positioned)
   - Adds text overlays with:
     - Mythic+ level (cyan-to-magenta gradient)
     - Dungeon name (gold)
     - Class and spec (class-specific color)
4. **Output**: Returns base64-encoded PNG image for download

## API Endpoints

### `POST /api/generateThumbnail`
Generates a thumbnail from character data.

**Request Body:**
```json
{
  "name": "CharacterName",
  "realm": "realm-slug",
  "region": "us"
}
```

**Response:**
```json
[{
  "imageBase64": "base64_encoded_png_string"
}]
```

### `POST /api/getRecentRun`
Fetches character's most recent Mythic+ run data.

**Query Parameters:**
- `name` - Character name
- `realm` - Realm slug
- `region` - Region (us, eu, kr, tw)

## Acknowledgments

- **Raider.IO** - For providing Mythic+ data and dungeon backgrounds
- **Blizzard Entertainment** - For the World of Warcraft API and character renders
