# Hero Carousel Media Setup Guide

The hero carousel component has been enhanced with video and audio support. This guide explains how to add your own media files.

## Video Setup

The hero carousel now supports optional background videos for each slide. Videos gracefully fallback to the static images if they fail to load.

### Adding Videos

1. **Create or obtain video files** (recommended specs):
   - Format: MP4 (H.264 codec)
   - Duration: 8-10 seconds (will loop)
   - Resolution: 1280x720 or higher
   - File size: 2-5 MB per video

2. **Place videos in `/public/videos/`**:
   ```
   /public/videos/
   ├── hero-bg-1.mp4
   ├── hero-bg-2.mp4
   └── hero-bg-3.mp4
   ```

3. **Video properties are already configured** in `components/HeroCarousel.tsx`:
   - Each slide has an optional `video` property
   - Videos autoplay (muted for browser compatibility)
   - Videos loop seamlessly
   - Images serve as fallback

### Video Best Practices

- **Use short videos**: 8-10 seconds max, as they loop
- **Keep file size small**: Compress videos for faster loading
- **Muted is best**: Sound is disabled for browser autoplay policies
- **Match image aspect ratio**: Use 16:9 aspect ratio for best results
- **Test on slow connections**: Ensure graceful fallback to images

## Audio Setup

The hero carousel includes an ambient sound toggle button that plays background music at low volume.

### Adding Audio

1. **Create or obtain an audio file**:
   - Format: MP3 or WAV
   - Duration: 30-60 seconds (will loop)
   - Volume level: Should be quiet (mixing at -20dB to -15dB)
   - Quality: 128 kbps MP3 or equivalent

2. **Place audio in `/public/audio/`**:
   ```
   /public/audio/
   └── ambient-luxury.mp3
   ```

3. **Audio is already configured** in `components/HeroCarousel.tsx`:
   - Plays at volume 0.2 (20%) for background ambiance
   - Loops seamlessly
   - User preference saved in localStorage
   - Respects browser autoplay policies

### Audio Best Practices

- **Keep it ambient**: Soft, non-intrusive background music
- **Seamless looping**: Ensure the audio loops without clicks
- **Low volume**: At 0.2 volume, it should be subtle background music
- **Optimize file size**: MP3 at 128 kbps is usually sufficient
- **Test looping**: Verify the audio loops smoothly without silence gaps

## Component Features

### Video Features
- ✓ Lazy loading (only loads current + adjacent slides)
- ✓ Automatic fallback to images on error
- ✓ Network detection (optional for slow connections)
- ✓ Muted autoplay for browser compatibility
- ✓ Smooth looping

### Audio Features
- ✓ User-controlled toggle button (Volume2/VolumeX icons)
- ✓ Low volume (0.2) for background ambiance
- ✓ Persistent user preference (localStorage)
- ✓ Seamless looping
- ✓ Respects browser autoplay policies

## Testing Your Media

1. **Local testing**:
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Test video playback and sound toggle
   ```

2. **Check browser console** for any media loading errors:
   - Video playback messages
   - Audio playback restrictions
   - Fallback behavior

3. **Test on mobile** to ensure:
   - Videos play correctly
   - Audio respects system volume
   - Buttons are easily clickable

## Troubleshooting

### Videos not playing?
- Check that MP4 files are in `/public/videos/` with correct filenames
- Verify browser supports H.264 video codec
- Check browser console for error messages
- Ensure images are still showing (fallback is working)

### Audio not playing?
- Confirm MP3 file is in `/public/audio/ambient-luxury.mp3`
- Check if browser has autoplay restrictions (some require user interaction first)
- Verify audio file format is supported (MP3/WAV)
- Check browser console for playback errors

### Media loading slowly?
- Optimize video file size (use ffmpeg or HandBrake)
- Use lower resolution if needed (720p minimum)
- Consider using MP4 instead of other formats
- Test on slow 3G connections

## File Locations

```
your-project/
├── components/
│   └── HeroCarousel.tsx (main component)
├── public/
│   ├── videos/
│   │   ├── hero-bg-1.mp4
│   │   ├── hero-bg-2.mp4
│   │   └── hero-bg-3.mp4
│   └── audio/
│       └── ambient-luxury.mp3
└── ...
```

## Notes

- Videos and audio are **optional** - the carousel works perfectly with just images
- All existing carousel features are preserved (navigation, animations, auto-advance)
- The component respects user preferences and browser policies
- Media is preloaded with sensible defaults
- No additional dependencies required (uses native HTML5 `<video>` and `<audio>`)
