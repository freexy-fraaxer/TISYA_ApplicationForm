import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import MissionBrief from "@/components/MissionBrief";

type MissionRole = "opportunists" | "members" | "ambassador" | "countryunion" | "partner";

const isMissionRole = (v: string | undefined): v is MissionRole =>
  v === "opportunists" || v === "members" || v === "ambassador" || v === "countryunion" || v === "partner";

const MissionPage = () => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();

  if (!isMissionRole(role)) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <MissionBrief
        role={role}
        onAccept={() => navigate(`/join/${role}`)}
        onBack={() => navigate("/")}
      />
    </motion.div>
  );
};

export default MissionPage;
