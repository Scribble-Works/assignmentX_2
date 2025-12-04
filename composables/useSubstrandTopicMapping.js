/**
 * Maps Supabase substrand IDs to Strapi topic IDs
 * 
 * This mapping connects your Supabase substrands to Strapi topics.
 * Update this mapping when you add new substrands or topics.
 * 
 * Format: { substrand_ref_id: strapi_topic_id }
 */
const substrandToTopicMapping = {
  // Mappings: { substrand_ref_id: strapi_topic_id }
  // Actual Strapi Topic IDs:
  // - Topic ID 2: "Whole Numbers Counting and Representation"
  // - Topic ID 4: "Whole Numbers Operations"
  // - Topic ID 6: "Fractions, Representation and Relationship"
  // - Topic ID 8: "Number: Ratios and Proportion"
  // - Topic ID 10: "Demonstrate an understanding of percent"
  
  // Update these mappings based on your Supabase substrand IDs
  // Format: substrand_id: strapi_topic_id
  2: 2,  // Substrand 2 -> Topic 2 (Whole Numbers Counting and Representation)
  3: 4,  // Substrand 3 -> Topic 4 (Whole Numbers Operations)
  4: 8,  // Substrand 4 -> Topic 8 (Number: Ratios and Proportion) - FIXED
  5: 6,  // Substrand 5 -> Topic 6 (Fractions, Representation and Relationship)
  6: 10, // Substrand 6 -> Topic 10 (Percent)
  // Add more mappings as needed based on your Supabase substrand IDs
};

/**
 * Get Strapi topic ID from Supabase substrand ID
 * @param {string|number} substrandRefId - The substrand ID from Supabase
 * @returns {number|null} The Strapi topic ID, or null if not found
 */
export const getTopicIdFromSubstrand = (substrandRefId) => {
  const substrandId = String(substrandRefId);
  const topicId = substrandToTopicMapping[substrandId];
  
  if (!topicId) {
    console.warn(`[Mapping] No topic ID found for substrand ID: ${substrandRefId}`);
    console.warn(`[Mapping] Available mappings:`, Object.keys(substrandToTopicMapping));
    return null;
  }
  
  console.log(`[Mapping] Substrand ID ${substrandRefId} maps to Strapi topic ID ${topicId}`);
  return topicId;
};

