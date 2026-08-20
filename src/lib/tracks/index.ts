import { TrackDefinition } from "@/lib/stationTypes";
import { softwareDevelopmentTrack } from "@/lib/tracks/softwareDevelopment";
import { databaseISTrack } from "@/lib/tracks/databaseIS";
import { salesBusinessDevelopmentTrack } from "@/lib/tracks/salesBusinessDevelopment";
import { softSkillsTrack } from "@/lib/tracks/softSkills";
import { cybersecurityTrack } from "@/lib/tracks/cybersecurity";

export const allTracks: TrackDefinition[] = [
  softwareDevelopmentTrack,
  databaseISTrack,
  salesBusinessDevelopmentTrack,
  cybersecurityTrack,
  softSkillsTrack,
];
