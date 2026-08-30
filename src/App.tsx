import { useMemo, useState } from "react";
import { Contact } from "./components/Contact";
import { Diagnostic } from "./components/Diagnostic";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { IndustryLens } from "./components/IndustryLens";
import { Method } from "./components/Method";
import { PageProgress } from "./components/PageProgress";
import { Proof } from "./components/Proof";
import { Transformation } from "./components/Transformation";
import { frictions, industries, stages, type FrictionId, type IndustryId, type ToolName } from "./content";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(2);
  const [selectedTools, setSelectedTools] = useState<ToolName[]>(["Email", "Sheets", "Paper"]);
  const [selectedFriction, setSelectedFriction] = useState<FrictionId>("manual");
  const [industry, setIndustry] = useState<IndustryId>("manufacturing");
  const [briefRequestVersion, setBriefRequestVersion] = useState(0);

  const brief = useMemo(() => {
    const stage = stages[selectedStage];
    const friction = frictions.find((item) => item.id === selectedFriction) ?? frictions[0];
    const sector = industries.find((item) => item.id === industry) ?? industries[0];
    const stack = selectedTools.length ? selectedTools.join(", ") : "not selected yet";
    return `Industry: ${sector.label}\nHandoff to inspect: ${stage.label}\nPrimary friction: ${friction.label}\nTools in the path: ${stack}\n\nWhat we should look at: `;
  }, [industry, selectedFriction, selectedStage, selectedTools]);

  return (
    <main>
      <PageProgress />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero selectedStage={selectedStage} setSelectedStage={setSelectedStage} />
      <Diagnostic
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        selectedTools={selectedTools}
        setSelectedTools={setSelectedTools}
        selectedFriction={selectedFriction}
        setSelectedFriction={setSelectedFriction}
        industry={industry}
        onUseBrief={() => setBriefRequestVersion((version) => version + 1)}
      />
      <Transformation selectedStage={selectedStage} />
      <Method />
      <IndustryLens industry={industry} setIndustry={setIndustry} />
      <Proof />
      <Contact brief={brief} briefRequestVersion={briefRequestVersion} />
    </main>
  );
}
