import { ref, computed } from 'vue';

export const useVideoRatings = () => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  // Get video rating from database or localStorage
  const getVideoRating = async (videoId) => {
    if (!videoId) return { likes: 0, rating: 0, userLiked: false, userRating: 0 };

    try {
      // Try to get from database if user is logged in
      if (user.value && user.value.id) {
        const { data: videoData } = await client
          .from('video_ratings')
          .select('*')
          .eq('video_id', videoId)
          .single();

        const { data: userRating } = await client
          .from('user_video_interactions')
          .select('*')
          .eq('video_id', videoId)
          .eq('user_id', user.value.id)
          .single();

        return {
          likes: videoData?.total_likes || 0,
          rating: videoData?.average_rating || 0,
          totalRatings: videoData?.total_ratings || 0,
          userLiked: userRating?.liked || false,
          userRating: userRating?.rating || 0
        };
      }

      // Fallback to localStorage for non-logged-in users
      if (process.client) {
        const stored = localStorage.getItem(`video_${videoId}`);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error('Error fetching video rating:', error);
    }

    return { likes: 0, rating: 0, totalRatings: 0, userLiked: false, userRating: 0 };
  };

  // Toggle like for a video
  const toggleLike = async (videoId) => {
    if (!videoId) return;

    try {
      if (user.value && user.value.id) {
        // Check current like status
        const { data: currentInteraction } = await client
          .from('user_video_interactions')
          .select('*')
          .eq('video_id', videoId)
          .eq('user_id', user.value.id)
          .single();

        const newLikedStatus = !currentInteraction?.liked;

        if (currentInteraction) {
          // Update existing interaction
          await client
            .from('user_video_interactions')
            .update({ liked: newLikedStatus, updated_at: new Date().toISOString() })
            .eq('video_id', videoId)
            .eq('user_id', user.value.id);
        } else {
          // Create new interaction
          await client
            .from('user_video_interactions')
            .insert({
              video_id: videoId,
              user_id: user.value.id,
              liked: newLikedStatus
            });
        }

        // Update video_ratings table
        const { data: videoRating } = await client
          .from('video_ratings')
          .select('*')
          .eq('video_id', videoId)
          .single();

        const newLikesCount = newLikedStatus
          ? (videoRating?.total_likes || 0) + 1
          : Math.max((videoRating?.total_likes || 0) - 1, 0);

        if (videoRating) {
          await client
            .from('video_ratings')
            .update({ total_likes: newLikesCount, updated_at: new Date().toISOString() })
            .eq('video_id', videoId);
        } else {
          await client
            .from('video_ratings')
            .insert({
              video_id: videoId,
              total_likes: newLikesCount,
              average_rating: 0,
              total_ratings: 0
            });
        }

        return newLikedStatus;
      }

      // Fallback to localStorage
      if (process.client) {
        const stored = localStorage.getItem(`video_${videoId}`);
        const data = stored ? JSON.parse(stored) : { likes: 0, rating: 0, totalRatings: 0, userLiked: false, userRating: 0 };
        
        data.userLiked = !data.userLiked;
        data.likes = data.userLiked ? data.likes + 1 : Math.max(data.likes - 1, 0);
        
        localStorage.setItem(`video_${videoId}`, JSON.stringify(data));
        return data.userLiked;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Rate a video (1-5 stars)
  const rateVideo = async (videoId, rating) => {
    if (!videoId || rating < 1 || rating > 5) return;

    try {
      if (user.value && user.value.id) {
        // Check if user already rated
        const { data: currentInteraction } = await client
          .from('user_video_interactions')
          .select('*')
          .eq('video_id', videoId)
          .eq('user_id', user.value.id)
          .single();

        const previousRating = currentInteraction?.rating || 0;

        if (currentInteraction) {
          // Update existing rating
          await client
            .from('user_video_interactions')
            .update({ rating, updated_at: new Date().toISOString() })
            .eq('video_id', videoId)
            .eq('user_id', user.value.id);
        } else {
          // Create new rating
          await client
            .from('user_video_interactions')
            .insert({
              video_id: videoId,
              user_id: user.value.id,
              rating
            });
        }

        // Update video_ratings table
        const { data: videoRating } = await client
          .from('video_ratings')
          .select('*')
          .eq('video_id', videoId)
          .single();

        let newTotalRatings, newAverageRating;

        if (videoRating) {
          const currentTotal = videoRating.average_rating * videoRating.total_ratings;
          
          if (previousRating > 0) {
            // User is changing their rating
            newTotalRatings = videoRating.total_ratings;
            newAverageRating = (currentTotal - previousRating + rating) / newTotalRatings;
          } else {
            // New rating
            newTotalRatings = videoRating.total_ratings + 1;
            newAverageRating = (currentTotal + rating) / newTotalRatings;
          }

          await client
            .from('video_ratings')
            .update({
              average_rating: newAverageRating,
              total_ratings: newTotalRatings,
              updated_at: new Date().toISOString()
            })
            .eq('video_id', videoId);
        } else {
          // Create new video rating entry
          await client
            .from('video_ratings')
            .insert({
              video_id: videoId,
              total_likes: 0,
              average_rating: rating,
              total_ratings: 1
            });
        }

        return rating;
      }

      // Fallback to localStorage
      if (process.client) {
        const stored = localStorage.getItem(`video_${videoId}`);
        const data = stored ? JSON.parse(stored) : { likes: 0, rating: 0, totalRatings: 0, userLiked: false, userRating: 0 };
        
        const previousRating = data.userRating;
        const currentTotal = data.rating * data.totalRatings;
        
        if (previousRating > 0) {
          data.rating = (currentTotal - previousRating + rating) / data.totalRatings;
        } else {
          data.totalRatings += 1;
          data.rating = (currentTotal + rating) / data.totalRatings;
        }
        
        data.userRating = rating;
        localStorage.setItem(`video_${videoId}`, JSON.stringify(data));
        return rating;
      }
    } catch (error) {
      console.error('Error rating video:', error);
    }
  };

  // Generate a unique video ID from URL
  const generateVideoId = (videoUrl) => {
    if (!videoUrl) return null;
    // Extract video ID from common video platforms or use hash
    const urlHash = videoUrl.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    return `video_${Math.abs(urlHash)}`;
  };

  return {
    getVideoRating,
    toggleLike,
    rateVideo,
    generateVideoId
  };
};
