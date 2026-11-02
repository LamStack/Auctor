"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export function SkillRadarChart({
  technicalSkill,
  problemSolving,
  softSkills,
}: {
  technicalSkill: number;
  problemSolving: number;
  softSkills: number;
}) {
  const data = [
    { skill: "Technical skill", value: technicalSkill },
    { skill: "Problem solving", value: problemSolving },
    { skill: "Soft skills", value: softSkills },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="rgb(var(--color-line))" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: "rgb(var(--color-ink))", fontSize: 12, fontWeight: 600 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgb(var(--color-muted))", fontSize: 10 }} />
        <Radar dataKey="value" stroke="#0FBEDE" fill="#0FBEDE" fillOpacity={0.35} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
