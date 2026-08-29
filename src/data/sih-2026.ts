// Source: https://www.sih.gov.in/ — themes actually present in the released
// SIH 2026 problem statements (seeded 2026-08-24 from sih.gov.in/sih2026PS).
export const SIH_2026_THEME_NAMES = [
  "Agriculture, FoodTech & Rural Development",
  "Blockchain & Cybersecurity",
  "Clean & Green Technology",
  "Disaster Management",
  "Fitness & Sports",
  "Heritage & Culture",
  "MedTech / BioTech / HealthTech",
  "Miscellaneous",
  "Renewable / Sustainable Energy",
  "Robotics and Drones",
  "Smart Automation",
  "Smart Education",
  "Smart Resource Conservation",
  "Smart Vehicles",
  "Space Technology",
  "Toys & Games",
  "Transportation & Logistics",
  "Travel & Tourism",
] as const;

// Source: SIH 2026 Guidelines, Ministry of Education's Innovation Cell, 29 July 2026.
export const SIH_2026_RULES = [
  "A team has exactly 6 student members, including the team leader.",
  "All student members must be from the same college; inter-college teams are not permitted.",
  "Every team must include at least one female member.",
  "The team name must be unique and must not contain the institute name in any form.",
  "Only teams selected through the internal hackathon may be nominated by the college SPOC to SIH.",
  "A team may submit ideas against a maximum of 2 problem statements on the SIH portal.",
  "The team leader must verify the roster, contact details, chosen problem statement, idea title, idea description, and Idea Presentation PDF on the official portal.",
  "Teams selected for the grand finale may include up to 2 industry or academic mentors in addition to the 6 student members.",
] as const;

export const SIH_2026_SOURCE_URL = "https://www.sih.gov.in/";
export const SIH_2026_GUIDELINES_URL =
  "https://www.sih.gov.in/letters/2026/SIH%202026%20Guidelines.pdf";

// SIH Internal Hackathon — REVA 2026 (external Microsoft Form registration)
// Keep this flag for other hackathons: set to "internal" to restore in-site registration + judges/mentors.
export const SIH_REGISTRATION_MODE: "external" | "internal" = "external";
export const SIH_2026_FORM_URL = "https://forms.cloud.microsoft/r/wJFucRCzkd";
export const SIH_2026_INTERNAL_DATES = "9th & 10th September 2026 (Wed & Thu)";
export const SIH_2026_INTERNAL_TIME = "8:30 AM – 4:30 PM";
export const SIH_2026_INTERNAL_VENUE =
  "REVA Rangasthala, Swami Vivekananda Block & Amphi Theatre, C V Raman Block";
export const SIH_2026_REGISTRATION_DEADLINE = "7th September 2026";
export const SIH_2026_CONTACT_NAME = "Prof. Kiran M";
export const SIH_2026_CONTACT_ROLE = "SPOC, REVA University — SIH 2026";
export const SIH_2026_CONTACT_PHONE = "9035505082";
