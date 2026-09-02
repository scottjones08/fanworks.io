import { useMemo, useState } from "react";
import { frictions, industries, stages, type FrictionId, type IndustryId, type ToolName } from "../content";

/** The Workday MRI selections, and the draft message they turn into. */
export function useBrief() {
  const [selectedStage, setSelectedStage] = useState(2);
  const [selectedTools, setSelectedTools] = useState<ToolName[]>(["Email", "Sheets", "Paper"]);
  const [selectedFriction, setSelectedFriction] = useState<FrictionId>("manual");
  const [industry, setIndustry] = useState<IndustryId>("manufacturing");
  const [briefVersion, setBriefVersion] = useState(0);

  const stage = stages[selectedStage];
  const friction = frictions.find((item) => item.id === selectedFriction) ?? frictions[0];
  const sector = industries.find((item) => item.id === industry) ?? industries[0];

  const brief = useMemo(() => {
    const stack = selectedTools.length ? selectedTools.join(", ") : "not selected yet";
    return `Industry: ${sector.label}\nHandoff to inspect: ${stage.label}\nPrimary friction: ${friction.label}\nTools in the path: ${stack}\n\nWhat we should look at: `;
  }, [sector.label, stage.label, friction.label, selectedTools]);

  const toggleTool = (tool: ToolName) =>
    setSelectedTools(selectedTools.includes(tool) ? selectedTools.filter((t) => t !== tool) : [...selectedTools, tool]);

  return {
    selectedStage,
    setSelectedStage,
    selectedTools,
    toggleTool,
    selectedFriction,
    setSelectedFriction,
    industry,
    setIndustry,
    stage,
    friction,
    sector,
    brief,
    briefVersion,
    requestBrief: () => setBriefVersion((v) => v + 1),
  };
}
