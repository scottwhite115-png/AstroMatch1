// lib/connectionUiHelpers.ts
// Helper functions to extract connection UI data from match engine results

import type {
  ChineseBasePattern,
  ChineseOverlayPattern,
  WesternElementRelation,
} from './connectionUi';
import type { ChinesePattern } from './matchEngine';

/**
 * Extract Chinese base pattern from match engine pattern
 */
export function extractChineseBase(
  pattern?: ChinesePattern | string
): ChineseBasePattern {
  if (!pattern) return 'NO_PATTERN';
  
  const patternUpper = String(pattern).toUpperCase();
  
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE')) {
    return 'SAN_HE';
  }
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET')) {
    return 'LIU_HE';
  }
  if (patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME_ANIMAL')) {
    return 'SAME_SIGN';
  }
  
  return 'NO_PATTERN';
}

/**
 * Extract Chinese overlay patterns from match engine pattern, all patterns, or chinese line
 */
export function extractChineseOverlays(
  pattern?: ChinesePattern | string,
  allPatterns?: string[],
  chineseLine?: string
): ChineseOverlayPattern[] {
  const overlays: ChineseOverlayPattern[] = [];
  
  // First check allPatterns if available
  if (allPatterns && allPatterns.length > 0) {
    for (const p of allPatterns) {
      const pUpper = String(p).toUpperCase();
      
      // Skip base patterns - only get overlays
      if (pUpper.includes('SAN_HE') || pUpper.includes('LIU_HE') || 
          pUpper.includes('SAME_SIGN') || pUpper.includes('SAME_ANIMAL') ||
          pUpper.includes('NEUTRAL') || pUpper.includes('FRIENDLY')) {
        continue;
      }
      
      if (pUpper.includes('LIU_CHONG') || pUpper.includes('六冲')) {
        overlays.push('LIU_CHONG');
      } else if (pUpper.includes('LIU_HAI') || pUpper.includes('六害')) {
        overlays.push('LIU_HAI');
      } else if (pUpper.includes('XING') || pUpper.includes('刑')) {
        overlays.push('XING');
      } else if (pUpper.includes('PO') || pUpper.includes('破')) {
        overlays.push('PO');
      }
    }
  }
  
  // If no overlays found and we have chineseLine, try extracting from there
  // Also check chineseLine even if we found some overlays, to catch all patterns
  if (chineseLine) {
    const lineUpper = chineseLine.toUpperCase();
    
    // Check for LIU_CHONG - can appear as main pattern or combined pattern
    if ((lineUpper.includes('LIU_CHONG') || lineUpper.includes('六冲')) && !overlays.includes('LIU_CHONG')) {
      overlays.push('LIU_CHONG');
    }
    
    // Check for LIU_HAI
    if ((lineUpper.includes('LIU_HAI') || lineUpper.includes('六害')) && !overlays.includes('LIU_HAI')) {
      overlays.push('LIU_HAI');
    }
    
    // Check for XING - can appear alone or combined (e.g., "Liu Chong + Xing")
    if ((lineUpper.includes('XING') || lineUpper.includes('刑')) && !overlays.includes('XING')) {
      // Make sure it's not part of another word
      if (lineUpper.match(/\bXING\b|刑/)) {
        overlays.push('XING');
      }
    }
    
    // Check for PO
    if ((lineUpper.includes('PO') || lineUpper.includes('破')) && !overlays.includes('PO')) {
      // Make sure it's not part of another word
      if (lineUpper.match(/\bPO\b|破/)) {
        overlays.push('PO');
      }
    }
  }
  
  // Remove duplicates
  return Array.from(new Set(overlays));
}

/**
 * Extract Western element relation from match engine relation
 */
export function extractWesternRelation(
  westElementRelation?: string
): WesternElementRelation {
  if (!westElementRelation) return 'NEUTRAL';
  
  const relationUpper = String(westElementRelation).toUpperCase();
  
  if (relationUpper.includes('SAME')) {
    return 'SAME';
  }
  if (relationUpper.includes('COMPATIBLE') && !relationUpper.includes('SEMI')) {
    return 'COMPATIBLE';
  }
  if (relationUpper.includes('SEMI_COMPATIBLE') || relationUpper.includes('SEMI-COMPATIBLE')) {
    return 'SEMI_COMPATIBLE';
  }
  if (relationUpper.includes('CLASH') || relationUpper.includes('OPPOSITE') || relationUpper.includes('MISMATCH')) {
    return 'CLASH';
  }
  
  return 'NEUTRAL';
}

/**
 * Get primary match label from various label formats
 */
export function extractPrimaryLabel(
  matchLabel?: string,
  rankLabel?: string,
  rank?: string
): string {
  const label = matchLabel || rankLabel || rank || 'Neutral Match';
  
  // Normalize common variations
  if (label.toLowerCase().includes('soulmate')) {
    return 'Soulmate Match';
  }
  if (label.toLowerCase().includes('twin flame')) {
    return 'Twin Flame Match';
  }
  if (label.toLowerCase().includes('secret friends')) {
    return 'Secret Friends Match';
  }
  if (label.toLowerCase().includes('strong harmony')) {
    return 'Strong Harmony Match';
  }
  if (label.toLowerCase().includes('magnetic opposites') || label.toLowerCase().includes('opposites attract')) {
    return 'Magnetic Opposites';
  }
  if (label.toLowerCase().includes('challenging') || label.toLowerCase().includes('difficult')) {
    return 'Challenging Match';
  }
  if (label.toLowerCase().includes('mirror')) {
    return 'Mirror Match';
  }
  
  return label;
}
