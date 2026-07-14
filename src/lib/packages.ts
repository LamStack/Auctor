export interface PackageTier {
  id: string;
  name: string;
  assessments: number | null; // null = custom/unlimited
  priceBHD: number | null; // null = "contact us"
  perAssessmentBHD: number | null;
  tagline: string;
  highlighted?: boolean;
}

export const PACKAGE_TIERS: PackageTier[] = [
  {
    id: "starter",
    name: "Starter",
    assessments: 50,
    priceBHD: 135,
    perAssessmentBHD: 2.7,
    tagline: "For a first hiring round or a single internship cohort.",
  },
  {
    id: "growth",
    name: "Growth",
    assessments: 150,
    priceBHD: 380,
    perAssessmentBHD: 2.53,
    tagline: "For teams hiring across multiple roles every quarter.",
    highlighted: true,
  },
  {
    id: "scale",
    name: "Scale",
    assessments: 400,
    priceBHD: 895,
    perAssessmentBHD: 2.24,
    tagline: "For high-volume graduate and internship pipelines.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    assessments: null,
    priceBHD: null,
    perAssessmentBHD: null,
    tagline: "Custom annual license with employee-based pricing for banks, telecoms, and large IT firms.",
  },
];

export function findPackage(id: string): PackageTier | undefined {
  return PACKAGE_TIERS.find((tier) => tier.id === id);
}
