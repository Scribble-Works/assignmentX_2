# Video Rating and Likes System - Setup & Documentation

## Overview

This system allows users to rate (1-5 stars) and like indicator videos across all learning modules. The system supports both authenticated users (with database persistence) and guest users (with localStorage fallback).

## Features

- ⭐ **Star Rating System**: 1-5 stars for video quality
- ❤️ **Like/Unlike**: Quick engagement metric
- 📊 **Real-time Stats**: Shows total likes and average ratings
- 💾 **Persistent Storage**: Database for logged-in users, localStorage for guests
- 🎯 **User-specific**: Tracks individual user interactions
- 📱 **Responsive Design**: Works on mobile and desktop
- ✨ **Smooth Animations**: Like button animation and success notifications

## Files Created

### 1. Composable: `useVideoRatings.js`

**Location:** `/composables/useVideoRatings.js`

Manages all video rating logic including:

- Fetching video ratings from database or localStorage
- Toggle like/unlike functionality
- Rating submission (1-5 stars)
- Automatic video ID generation
- Fallback to localStorage for non-authenticated users

### 2. Component: `videoRating.vue`

**Location:** `/components/videoRating.vue`

UI component displaying:

- Like button with count
- 5-star rating interface
- Average rating display
- Total ratings count
- Success notifications
- Animated feedback

### 3. Updated Components

- **`vids.vue`**: Added rating section below video player
- **`introvid.vue`**: Added rating section for intro videos

### 4. Updated Pages

All indicator detail pages across workbooks now display ratings:

- `/pages/learning-modules/preassignment_workbook1/strand-[id]/substrand-[route]/[id].vue`
- `/pages/learning-modules/preassignment_workbook2/strand-[id]/substrand-[route]/[id].vue`
- `/pages/learning-modules/preassignment_workbook3/strand-[id]/substrand-[route]/[id].vue`
- `/pages/learning-modules/assignment_workbook1/strand-[id]/substrand-[route]/[id].vue`
- `/pages/learning-modules/assignment_workbook2/strand-[id]/substrand-[route]/[id].vue`
- `/pages/learning-modules/assignment_workbook3/strand-[id]/substrand-[route]/[id].vue`

## Database Setup

### Required Tables

You need to create two tables in your Supabase database:

#### 1. `video_ratings` Table

Stores aggregate rating data for each video.

```sql
-- Create video_ratings table
CREATE TABLE video_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  total_likes INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_video_ratings_video_id ON video_ratings(video_id);

-- Enable Row Level Security
ALTER TABLE video_ratings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read video ratings
CREATE POLICY "Anyone can view video ratings" ON video_ratings
  FOR SELECT USING (true);

-- Policy: Authenticated users can insert
CREATE POLICY "Authenticated users can insert video ratings" ON video_ratings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update
CREATE POLICY "Authenticated users can update video ratings" ON video_ratings
  FOR UPDATE USING (auth.role() = 'authenticated');
```

#### 2. `user_video_interactions` Table

Stores individual user interactions (likes and ratings).

```sql
-- Create user_video_interactions table
CREATE TABLE user_video_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  liked BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(video_id, user_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_user_video_interactions_video_id ON user_video_interactions(video_id);
CREATE INDEX idx_user_video_interactions_user_id ON user_video_interactions(user_id);
CREATE INDEX idx_user_video_interactions_composite ON user_video_interactions(video_id, user_id);

-- Enable Row Level Security
ALTER TABLE user_video_interactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own interactions
CREATE POLICY "Users can view own interactions" ON user_video_interactions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own interactions
CREATE POLICY "Users can insert own interactions" ON user_video_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own interactions
CREATE POLICY "Users can update own interactions" ON user_video_interactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own interactions
CREATE POLICY "Users can delete own interactions" ON user_video_interactions
  FOR DELETE USING (auth.uid() = user_id);
```

### Optional: Create Updated_At Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for video_ratings
CREATE TRIGGER update_video_ratings_updated_at
  BEFORE UPDATE ON video_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_video_interactions
CREATE TRIGGER update_user_video_interactions_updated_at
  BEFORE UPDATE ON user_video_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Usage

### Basic Usage (Automatic)

The rating system is automatically displayed on all indicator videos. No additional code needed!

```vue
<!-- Main video automatically shows ratings -->
<vids :url="vid1" :showRating="true" />

<!-- Related videos hide ratings to avoid clutter -->
<vids :url="video" :showRating="false" />
```

### Custom Usage

If you want to add ratings to other videos:

```vue
<template>
  <div>
    <!-- Your video player -->
    <iframe :src="videoUrl"></iframe>

    <!-- Add rating component -->
    <VideoRating :videoUrl="videoUrl" :videoId="customVideoId" />
  </div>
</template>

<script setup>
const videoUrl = ref("https://youtube.com/embed/...");
const customVideoId = ref("custom-video-1"); // Optional: provide your own ID
</script>
```

### Props

#### `vids.vue` / `introvid.vue`

- `url` / `intro` (String, required): Video URL
- `showRating` (Boolean, default: true): Show/hide rating section
- `videoId` (String, optional): Custom video identifier

#### `VideoRating.vue`

- `videoUrl` (String, required): Video URL for generating ID
- `videoId` (String, optional): Custom video identifier (overrides auto-generation)

## How It Works

### For Authenticated Users

1. User likes/rates a video
2. Data is stored in `user_video_interactions` table
3. Aggregate stats are updated in `video_ratings` table
4. Real-time updates reflect across the platform

### For Guest Users

1. User likes/rates a video
2. Data is stored in browser's localStorage
3. Data persists within the same browser
4. When user logs in, they can start fresh with database storage

### Video ID Generation

- Videos are identified by a hash of their URL
- Consistent IDs ensure the same video shows same ratings across pages
- Custom IDs can be provided for more control

## UI Features

### Like Button

- ❤️ Red when liked
- 🤍 Outline when not liked
- Animated heart on click
- Shows total like count
- Instant feedback

### Rating System

- 5 gold stars
- Hover preview
- Shows average rating
- Displays total rating count
- Instant update on selection

### Success Notifications

- "Thanks for liking this video!"
- "Thanks for rating this video!"
- Auto-dismisses after 2 seconds
- Non-intrusive bottom snackbar

## Responsive Design

- **Desktop**: Full layout with side-by-side like and rating
- **Tablet**: Stacked with proper spacing
- **Mobile**: Compact view with scaled-down rating stars

## Analytics & Insights

### Video Performance Metrics

You can query the database to get insights:

```sql
-- Top rated videos
SELECT video_id, average_rating, total_ratings, total_likes
FROM video_ratings
WHERE total_ratings >= 10
ORDER BY average_rating DESC, total_ratings DESC
LIMIT 20;

-- Most liked videos
SELECT video_id, total_likes, average_rating
FROM video_ratings
ORDER BY total_likes DESC
LIMIT 20;

-- User engagement
SELECT
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_interactions,
  SUM(CASE WHEN liked THEN 1 ELSE 0 END) as total_likes,
  AVG(rating) as avg_rating_given
FROM user_video_interactions;
```

## Troubleshooting

### Ratings not saving

1. Check if Supabase tables are created correctly
2. Verify RLS policies are enabled
3. Check browser console for errors
4. Ensure user is authenticated for database storage

### LocalStorage fallback issues

1. Check if localStorage is enabled in browser
2. Private/incognito mode may block localStorage
3. Check browser storage quota

### Video ID conflicts

1. Use custom `videoId` prop for unique identification
2. Ensure video URLs are consistent
3. Check for duplicate video IDs in database

## Future Enhancements

Potential improvements:

1. **Comments Section**: Allow users to leave text feedback
2. **Detailed Analytics Dashboard**: Admin panel for video performance
3. **Trending Videos**: Highlight most popular content
4. **Recommended Based on Ratings**: Suggest similar high-rated videos
5. **Export Data**: Allow users to export their rating history
6. **Social Sharing**: Share favorite videos with ratings
7. **Moderation Tools**: Flag inappropriate content
8. **Video Comparison**: Compare ratings across similar topics

## Best Practices

1. **Monitor Database Growth**: Clean up old interaction data periodically
2. **Cache Popular Videos**: Consider caching frequently accessed ratings
3. **A/B Testing**: Test different rating UI placements
4. **User Privacy**: Respect user data and provide opt-out options
5. **Performance**: Lazy load rating component for better page speed

## Migration Notes

If you already have videos in production:

1. All existing videos will start with 0 ratings
2. Users can immediately start rating
3. Historical data won't be affected
4. Consider seeding with initial ratings if needed

---

**Version:** 1.0  
**Created:** March 2026  
**Last Updated:** March 2026  
**Maintainer:** AssignmentX Development Team
