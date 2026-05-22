import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RoleSelection from "@/components/RoleSelection";
import SEO from "@/components/SEO";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";

type MissionRole = "opportunists" | "members" | "ambassador" | "partner";

const RolesPage = () => {
  const navigate = useNavigate();
  const { setBackgroundBlurred } = useBackgroundEffects();

  useEffect(() => {
    setBackgroundBlurred(true);
    return () => setBackgroundBlurred(false);
  }, [setBackgroundBlurred]);

  const handleClose = () => {
    setBackgroundBlurred(false);
    navigate("/");
  };

  const handleSelectRole = (role: MissionRole) => {
    setBackgroundBlurred(false);
    navigate(`/mission/${role}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title="Choose Your Path — TİSYA Roles"
        description="Pick a path in TİSYA: Pathfinder, Opportunist, Ambassador, or Partner. Find the role that fits your impact."
        path="/roles"
      />
      <RoleSelection
        isOpen={true}
        onClose={handleClose}
        onSelectOpportunists={() => handleSelectRole("opportunists")}
        onSelectMembers={() => handleSelectRole("members")}
        onSelectAmbassador={() => handleSelectRole("ambassador")}
        onSelectPartner={() => handleSelectRole("partner")}
      />
    </motion.div>
  );
};

export default RolesPage;
