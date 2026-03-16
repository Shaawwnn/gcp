/**
 * Common types used across multiple services
 */

/**
 * Helper type for Firestore timestamps
 * This allows compatibility between client and server
 */
export type FirestoreTimestamp = 
  | { seconds: number; nanoseconds: number }
  | Date;
