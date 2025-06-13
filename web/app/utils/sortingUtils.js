/**
 * Custom article sequences for different sort options
 * These are hardcoded orders that don't loop
 */
export const sortSequences = {
  Popular: [5, 3, 1, 6, 2, 4], // Most interactions
  Recent: [6, 4, 2, 5, 3, 1],  // Newest first
  Hot: [3, 1, 5, 2, 6, 4]      // Trending (high interactions per day)
};

/**
 * Gets the next article ID in a sequence based on sort option and current ID
 * @param {string} sortOption - The selected sort option
 * @param {number} currentId - The current article ID
 * @param {string} direction - 'forward' or 'backward'
 * @returns {number|null} - The next article ID or null if end of sequence
 */
export function getNextArticleId(sortOption, currentId, direction = 'forward') {
  // Use database next/prev if sort is Auto
  if (sortOption === 'Auto') {
    return null; // Let the app use DB provided next/prev
  }
  
  // Get the appropriate sequence
  const sequence = sortSequences[sortOption] || [];
  if (sequence.length === 0) return null;
  
  // Find current position in sequence
  const currentIndex = sequence.indexOf(currentId);
  
  // If not in sequence, return first/last item based on direction
  if (currentIndex === -1) {
    return direction === 'forward' ? sequence[0] : sequence[sequence.length - 1];
  }
  
  // Calculate next position
  const nextIndex = direction === 'forward' ? 
    currentIndex + 1 : 
    currentIndex - 1;
  
  // Return next ID or null if end of sequence
  return (nextIndex >= 0 && nextIndex < sequence.length) ? 
    sequence[nextIndex] : 
    null;
}