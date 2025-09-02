import { useState, useEffect } from 'react';

/**
 * Hook to safely handle SSR/client hydration mismatches
 * Returns true only after the component has mounted on the client
 * 
 * Use this when you have dynamic values that differ between server and client
 * rendering, such as:
 * - Values from localStorage/sessionStorage
 * - Current timestamp
 * - Random values
 * - User-specific data from stores
 * 
 * @returns {boolean} true if component is mounted on client, false during SSR
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const isMounted = useSSRSafe();
 *   const { balance } = useStore();
 *   
 *   return (
 *     <input 
 *       max={isMounted ? balance : 1000} // Use fallback during SSR
 *       placeholder="Enter amount"
 *     />
 *   );
 * };
 * ```
 */
export const useSSRSafe = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return isMounted;
};

/**
 * Hook to safely get a value that might cause hydration mismatch
 * Returns fallback value during SSR, actual value after mounting
 * 
 * @param getValue - Function that returns the actual value
 * @param fallback - Fallback value to use during SSR
 * @returns The actual value after mounting, fallback during SSR
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { balance } = useStore();
 *   const safeMaxValue = useSSRSafeValue(() => balance, 1000);
 *   
 *   return (
 *     <input 
 *       max={safeMaxValue}
 *       placeholder="Enter amount"
 *     />
 *   );
 * };
 * ```
 */
export const useSSRSafeValue = <T>(getValue: () => T, fallback: T): T => {
  const isMounted = useSSRSafe();
  return isMounted ? getValue() : fallback;
};

export default useSSRSafe;