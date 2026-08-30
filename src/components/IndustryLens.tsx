import {
  ChartLineUp,
  Factory,
  FirstAidKit,
  Scales,
  Storefront,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { industries, type IndustryId } from "../content";

type IndustryLensProps = {
  industry: IndustryId;
  setIndustry: (industry: IndustryId) => void;
};

const iconByIndustry = {
  manufacturing: Factory,
  health: FirstAidKit,
  wealth: ChartLineUp,
  retail: Storefront,
  legal: Scales,
};

export function IndustryLens({ industry, setIndustry }: IndustryLensProps) {
  const active = industries.find((item) => item.id === industry) ?? industries[0];
  const ActiveIcon = iconByIndustry[active.id];

  return (
    <section className="industry-lens section-pad" id="industries" aria-labelledby="industries-title">
      <div className="section-marker section-marker-light">
        <span>04</span>
        <i />
        <span>Industry lenses</span>
      </div>
      <div className="industry-heading">
        <div>
          <p className="eyebrow">Different work. Familiar friction.</p>
          <h2 id="industries-title">Choose the line that looks like yours.</h2>
        </div>
        <p>
          The vocabulary changes. The operating problem usually does not: context breaks at the handoff,
          and people carry the difference.
        </p>
      </div>

      <div className="industry-interface">
        <div className="industry-tabs" role="tablist" aria-label="Choose an industry lens">
          {industries.map((item) => {
            const Icon = iconByIndustry[item.id];
            return (
              <button
                type="button"
                role="tab"
                aria-selected={industry === item.id}
                key={item.id}
                className={industry === item.id ? "is-active" : ""}
                onClick={() => setIndustry(item.id)}
              >
                <Icon size={22} weight={industry === item.id ? "fill" : "regular"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            className="industry-story"
            key={active.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="industry-story-copy">
              <span>{active.eyebrow}</span>
              <ActiveIcon size={42} weight="duotone" />
              <h3>{active.headline}</h3>
              <p>{active.body}</p>
            </div>
            <ol className="industry-flow" aria-label={`${active.label} operating line`}>
              {active.flow.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.055 }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </motion.li>
              ))}
            </ol>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
