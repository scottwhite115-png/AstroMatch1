/**
 * Fusion Archetypes - Character descriptions for each sign combination
 * Data loaded from astromatch_fusion_archetypes_144.json
 */

import fusionArchetypesData from "@/data/astromatch_fusion_archetypes_144.json"

interface FusionArchetypeData {
  key: string
  archetype_name: string
  essence: string
  strengths: string[]
  growth_edges: string[]
  elemental_trine_note: string
  trine: number
  western_element: string
}

// Build a map for fast lookup
const fusionArchetypesMap = new Map<string, FusionArchetypeData>()

// Populate the map
fusionArchetypesData.forEach((archetype: FusionArchetypeData) => {
  fusionArchetypesMap.set(archetype.key, archetype)
})

/**
 * Get fusion archetype data for a sign combination
 * @param western - Western zodiac sign (e.g., "aries")
 * @param eastern - Eastern zodiac sign (e.g., "rat")
 * @returns The fusion archetype data or null if not found
 */
export function getFusionArchetypeData(western: string, eastern: string): FusionArchetypeData | null {
  const key = `${western.toLowerCase()}_${eastern.toLowerCase()}`
  return fusionArchetypesMap.get(key) || null
}

/**
 * Get formatted fusion archetype description for display
 * @param western - Western zodiac sign (e.g., "aries")
 * @param eastern - Eastern zodiac sign (e.g., "rat")
 * @returns Formatted description string
 */
export function getFusionArchetype(western: string, eastern: string): string {
  const data = getFusionArchetypeData(western, eastern)
  
  if (!data) {
    const capitalizedWestern = western.charAt(0).toUpperCase() + western.slice(1)
    const capitalizedEastern = eastern.charAt(0).toUpperCase() + eastern.slice(1)
    return `The ${capitalizedWestern} ${capitalizedEastern} fusion represents a unique blend of Western and Eastern astrological energies.`
  }
  
  // Format the description
  const strengthsList = data.strengths.map(s => `• ${s}`).join('\n')
  const growthList = data.growth_edges.map(g => `• ${g}`).join('\n')
  
  return `${data.essence}

**Archetype: ${data.archetype_name}**

**Core Strengths:**
${strengthsList}

**Growth Edges:**
${growthList}

${data.elemental_trine_note}`
}

/**
 * Get just the archetype name
 */
export function getArchetypeName(western: string, eastern: string): string {
  const data = getFusionArchetypeData(western, eastern)
  return data?.archetype_name || "Fusion Archetype"
}

/**
 * Get just the essence
 */
export function getArchetypeEssence(western: string, eastern: string): string {
  const data = getFusionArchetypeData(western, eastern)
  return data?.essence || ""
}
