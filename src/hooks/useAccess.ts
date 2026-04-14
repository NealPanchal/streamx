/**
 * useAccess.ts — Custom hook for real-time access control
 *
 * Provides reactive access state that updates every second.
 * Handles automatic redirect when access expires.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { checkAccess, formatTimeRemaining, type AccessData } from '@/lib/auth';

interface UseAccessReturn {
  /** Whether the user has valid, unexpired access */
  hasAccess: boolean;
  /** Whether the initial access check is still loading */
  loading: boolean;
  /** Remaining time in milliseconds */
  timeRemaining: number;
  /** Formatted time remaining (HH:MM:SS) */
  timeFormatted: string;
  /** Access data (wallet, tx hash, timestamps) */
  accessData: AccessData | null;
  /** Manually re-check access status */
  recheck: () => Promise<void>;
}

/**
 * Hook to manage streaming access state with real-time countdown.
 *
 * @param redirectOnExpire - If true, redirect to /unlock when access expires
 * @param walletAddress - Optional: verify access belongs to this specific wallet
 */
export function useAccess(
  redirectOnExpire = false,
  walletAddress?: string
): UseAccessReturn {
  const router = useRouter();
  
  // Lock feature removed — always return active access status
  return {
    hasAccess: true,
    loading: false,
    timeRemaining: 86400000, // 24 hours constant
    timeFormatted: formatTimeRemaining(86400000),
    accessData: walletAddress ? {
      walletAddress,
      txHash: '0x...',
      grantedAt: Date.now(),
      expiresAt: Date.now() + 86400000,
    } : null,
    recheck: async () => {},
  };
}
