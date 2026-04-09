import { ref, computed } from 'vue';

export const useVideoRatings = () => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  // Generate a unique video ID from URL
  const generateVideoId = (videoUrl) => {
    if (!videoUrl) return null;
    const urlHash = videoUrl.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    return `video_${Math.abs(urlHash)}`;
  };

  // Get video rating from database or localStorage
  const getVideoRating = async (videoId) => {
    if (!videoId) return { likes: 0, dislikes: 0, rating: 0, totalRatings: 0, userLiked: false, userDisliked: false, userRating: 0 };

    try {
      if (user.value && user.value.id) {
        const { data: videoData } = await client
          .from('video_ratings')
          .select('*')
          .eq('video_id', videoId)
          .single();

        const { data: userInteraction } = await client
          .from('user_video_interactions')
          .select('*')
          .eq('video_id', videoId)
          .eq('user_id', user.value.id)
          .single();

        return {
          likes: videoData?.total_likes || 0,
          dislikes: videoData?.total_dislikes || 0,
          rating: videoData?.average_rating || 0,
          totalRatings: videoData?.total_ratings || 0,
          userLiked: userInteraction?.liked || false,
          userDisliked: userInteraction?.disliked || false,
          userRating: userInteraction?.rating || 0
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

    return { likes: 0, dislikes: 0, rating: 0, totalRatings: 0, userLiked: false, userDisliked: false, userRating: 0 };
  };

  // Ensure the video_ratings row exists, return it
  const ensureVideoRating = async (videoId) => {
    const { data: existing } = await client
      .from('video_ratings')
      .select('*')
      .eq('video_id', videoId)
      .single();

    if (existing) return existing;

    const { data: created } = await client
      .from('video_ratings')
      .insert({ video_id: videoId, total_likes: 0, total_dislikes: 0, average_rating: 0, total_ratings: 0 })
      .select()
      .single();

    return created;
  };

  // Ensure the user_video_interactions row exists, return it
  const ensureUserInteraction = async (videoId) => {
    const { data: existing } = await client
      .from('user_video_interactions')
      .select('*')
      .eq('video_id', videoId)
      .eq('user_id', user.value.id)
      .single();

    if (existing) return existing;

    const { data: created } = await client
      .from('user_video_interactions')
      .insert({ video_id: videoId, user_id: user.value.id, liked: false, disliked: false, rating: 0 })
      .select()
      .single();

    return created;
  };

  // Toggle like for a video
  const toggleLike = async (videoId) => {
    if (!videoId) return;

    try {
      if (user.value && user.value.id) {
        const interaction = await ensureUserInteraction(videoId);
        const videoRating = await ensureVideoRating(videoId);

        const wasLiked = interaction.liked;
        const wasDisliked = interaction.disliked;
        const newLiked = !wasLiked;

        // Update user interaction: toggle like, clear dislike if setting like
        await client
          .from('user_video_interactions')
          .update({
            liked: newLiked,
            disliked: newLiked ? false : interaction.disliked,
            updated_at: new Date().toISOString()
          })
          .eq('video_id', videoId)
          .eq('user_id', user.value.id);

        // Calculate new counts
        let newLikes = videoRating.total_likes || 0;
        let newDislikes = videoRating.total_dislikes || 0;

        if (newLiked) {
          newLikes += 1;
          if (wasDisliked) newDislikes = Math.max(newDislikes - 1, 0);
        } else {
          newLikes = Math.max(newLikes - 1, 0);
        }

        await client
          .from('video_ratings')
          .update({ total_likes: newLikes, total_dislikes: newDislikes, updated_at: new Date().toISOString() })
          .eq('video_id', videoId);

        return { liked: newLiked, disliked: newLiked ? false : wasDisliked, likes: newLikes, dislikes: newDislikes };
      }

      // Fallback to localStorage
      if (process.client) {
        const stored = localStorage.getItem(`video_${videoId}`);
        const data = stored ? JSON.parse(stored) : { likes: 0, dislikes: 0, userLiked: false, userDisliked: false };

        if (!data.userLiked) {
          data.likes += 1;
          if (data.userDisliked) {
            data.dislikes = Math.max(data.dislikes - 1, 0);
            data.userDisliked = false;
          }
          data.userLiked = true;
        } else {
          data.likes = Math.max(data.likes - 1, 0);
          data.userLiked = false;
        }

        localStorage.setItem(`video_${videoId}`, JSON.stringify(data));
        return { liked: data.userLiked, disliked: data.userDisliked, likes: data.likes, dislikes: data.dislikes };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Toggle dislike for a video
  const toggleDislike = async (videoId) => {
    if (!videoId) return;

    try {
      if (user.value && user.value.id) {
        const interaction = await ensureUserInteraction(videoId);
        const videoRating = await ensureVideoRating(videoId);

        const wasLiked = interaction.liked;
        const wasDisliked = interaction.disliked;
        const newDisliked = !wasDisliked;

        // Update user interaction: toggle dislike, clear like if setting dislike
        await client
          .from('user_video_interactions')
          .update({
            disliked: newDisliked,
            liked: newDisliked ? false : interaction.liked,
            updated_at: new Date().toISOString()
          })
          .eq('video_id', videoId)
          .eq('user_id', user.value.id);

        // Calculate new counts
        let newLikes = videoRating.total_likes || 0;
        let newDislikes = videoRating.total_dislikes || 0;

        if (newDisliked) {
          newDislikes += 1;
          if (wasLiked) newLikes = Math.max(newLikes - 1, 0);
        } else {
          newDislikes = Math.max(newDislikes - 1, 0);
        }

        await client
          .from('video_ratings')
          .update({ total_likes: newLikes, total_dislikes: newDislikes, updated_at: new Date().toISOString() })
          .eq('video_id', videoId);

        return { liked: newDisliked ? false : wasLiked, disliked: newDisliked, likes: newLikes, dislikes: newDislikes };
      }

      // Fallback to localStorage
      if (process.client) {
        const stored = localStorage.getItem(`video_${videoId}`);
        const data = stored ? JSON.parse(stored) : { likes: 0, dislikes: 0, userLiked: false, userDisliked: false };

        if (!data.userDisliked) {
          data.dislikes += 1;
          if (data.userLiked) {
            data.likes = Math.max(data.likes - 1, 0);
            data.userLiked = false;
          }
          data.userDisliked = true;
        } else {
          data.dislikes = Math.max(data.dislikes - 1, 0);
          data.userDisliked = false;
        }

        localStorage.setItem(`video_${videoId}`, JSON.stringify(data));
        return { liked: data.userLiked, disliked: data.userDisliked, likes: data.likes, dislikes: data.dislikes };
      }
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  // Rate a video (1-5 stars)
  const rateVideo = async (videoId, rating) => {
    if (!videoId || rating < 1 || rating > 5) return;

    try {
      if (user.value && user.value.id) {
        const interaction = await ensureUserInteraction(videoId);
        const videoRating = await ensureVideoRating(videoId);

        const previousRating = interaction.rating || 0;

        await client
          .from('user_video_interactions')
          .update({ rating, updated_at: new Date().toISOString() })
          .eq('video_id', videoId)
          .eq('user_id', user.value.id);

        const currentTotal = videoRating.average_rating * videoRating.total_ratings;
        let newTotalRatings, newAverageRating;

        if (previousRating > 0) {
          newTotalRatings = videoRating.total_ratings;
          newAverageRating = (currentTotal - previousRating + rating) / newTotalRatings;
        } else {
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

        return rating;
      }

      // Fallback to localStorage
      if (process.client) {
        const stored = localStorage.getItem(`video_${videoId}`);
        const data = stored ? JSON.parse(stored) : { likes: 0, dislikes: 0, rating: 0, totalRatings: 0, userLiked: false, userDisliked: false, userRating: 0 };

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

  return {
    getVideoRating,
    toggleLike,
    toggleDislike,
    rateVideo,
    generateVideoId
  };
};
