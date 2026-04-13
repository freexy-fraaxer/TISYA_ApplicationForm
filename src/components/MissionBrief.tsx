import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import { ArrowLeft, ArrowRight, Shield, Zap, Star } from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

type RolePath = "operators" | "members" | "ambassador" | "countryunion" | "partner";

interface MissionBriefProps {
  role: RolePath;
  onAccept: () => void;
  onBack: () => void;
}

const missionData: Record<RolePath, {
  title: string;
  mission: string;
  unlocks: string[];
  impact: string;
}> = {
  members: {
    title: "Pathfinder",
    mission: "Explore opportunities, connect with peers, and navigate the TISYA network at your own pace.",
    unlocks: [
      "Access to community events and meetups",
      "Connect with students across Türkiye",
      "Stay updated on opportunities and resources",
    ],
    impact: "Every Pathfinder strengthens the network — your presence matters.",
  },
  operators: {
    title: "Operator",
    mission: "Create, manage, and bring ideas to life. You'll be the engine behind TISYA's programs and initiatives.",
    unlocks: [
      "Work on real projects with a global team",
      "Build your portfolio with impactful work",
      "Access leadership and skill-building tracks",
    ],
    impact: "Operators turn vision into reality — you're the backbone of The Alliance.",
  },
  ambassador: {
    title: "Ambassador",
    mission: "Represent TISYA across your campus, city, or country. Be the voice and bridge for your community.",
    unlocks: [
      "Official TISYA Ambassador title and resources",
      "Lead local initiatives and events",
      "Direct channel to TISYA leadership",
    ],
    impact: "Ambassadors are the face of TISYA — you set the tone for your community.",
  },
  countryunion: {
    title: "Country Union",
    mission: "Lead partnerships and represent your organization's affiliation with TISYA for long-term collaboration.",
    unlocks: [
      "Structural partnership with TISYA",
      "Joint programming and resource sharing",
      "Representation in TISYA's governance structure",
    ],
    impact: "Country Unions create lasting institutional bridges across borders.",
  },
  partner: {
    title: "Partner / Sponsor",
    mission: "Collaborate with TISYA as an organization or sponsor. Support impactful student initiatives across Türkiye.",
    unlocks: [
      "Visibility across TISYA's network and events",
      "Co-branded programs and campaigns",
      "Access to a diverse international student community",
    ],
    impact: "Partners fuel the mission — together we create opportunities that last.",
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const MissionBrief = ({ role, onAccept, onBack }: MissionBriefProps) => {
  const { playPulse, playBack } = useSound();
  const data = missionData[role];

  const handleAccept = () => {
    playPulse();
    onAccept();
  };

  const handleBack = () => {
    playBack();
    onBack();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <GlassCard
        className="max-w-xl w-full p-8 md:p-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Back button */}
        <motion.button
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6"
          onClick={handleBack}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to paths</span>
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-8"
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/70 mb-2">
            Path Selected
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground glow-text">
            {data.title}
          </h2>
        </motion.div>

        {/* Mission */}
        <motion.div
          className="mb-6 p-4 rounded-lg bg-secondary/30 border border-border/50"
          custom={1}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Your Mission
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.mission}
          </p>
        </motion.div>

        {/* What You Unlock */}
        <motion.div
          className="mb-6 p-4 rounded-lg bg-secondary/30 border border-border/50"
          custom={2}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              What You Unlock
            </span>
          </div>
          <ul className="space-y-2">
            {data.unlocks.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Your Impact */}
        <motion.div
          className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20"
          custom={3}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Your Impact
            </span>
          </div>
          <p className="text-sm text-foreground/80 italic leading-relaxed">
            {data.impact}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          custom={4}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
        >
          <HeroButton onClick={handleAccept} size="lg">
            Accept Mission
            <ArrowRight className="w-5 h-5" />
          </HeroButton>
        </motion.div>
      </GlassCard>
    </div>
  );
};

export default MissionBrief;
