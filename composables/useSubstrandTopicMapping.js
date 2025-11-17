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
  // Based on your Strapi data:
  // - Topic ID 9: "Whole Numbers Counting and Representation" (has 4 questions)
  // - Topic ID 10: "Number: Ratio and Proportions" (has 3 questions)
  // - Topic ID 11: "Fractions, Representations and Relationships" (has 2 questions)
  
  2: 9,  // Substrand 2 -> Topic 9 (Whole Numbers Counting and Representation)
  4: 10, // Substrand 4 -> Topic 10 (Number: Ratio and Proportions)
  // Add more mappings as needed:
  // 1: 9,  // Example: if substrand 1 also maps to topic 9
  // 3: 11, // Example: if substrand 3 maps to topic 11
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

