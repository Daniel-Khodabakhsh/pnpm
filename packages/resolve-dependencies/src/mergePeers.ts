import { MissingPeerIssuesByPeerName } from '@pnpm/types'
import { intersect } from 'semver-range-intersect'

export function mergePeers (missingPeers: MissingPeerIssuesByPeerName) {
  const conflicts: string[] = []
  const intersections: Record<string, string> = {}
  for (const [peerName, ranges] of Object.entries(missingPeers)) {
    if (ranges.every(({ optional }) => optional)) continue
    if (ranges.length === 1) {
      intersections[peerName] = ranges[0].wantedRange
      continue
    }
    const intersection = intersect(...ranges.map(({ wantedRange }) => wantedRange))
    if (intersection === null) {
      conflicts.push(peerName)
    } else {
      intersections[peerName] = intersection
    }
  }
  return { conflicts, intersections }
}