import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import OpportunistForm from "@/components/OpportunistForm";
import PathfinderForm from "@/components/PathfinderForm";
import AmbassadorForm from "@/components/AmbassadorForm";
import PartnerSponsorForm from "@/components/PartnerSponsorForm";
import SEO from "@/components/SEO";

type JoinRole = "opportunists" | "members" | "ambassador" | "partner";

const isJoinRole = (v: string | undefined): v is JoinRole =>
  v === "opportunists" || v === "members" || v === "ambassador" || v === "partner";

const JOIN_META: Record<JoinRole, { title: string; description: string }> = {
  opportunists: { title: "Apply as Opportunist — TİSYA", description: "Apply as an Opportunist (Volunteer) and bring your skills to the TİSYA Alliance." },
  members: { title: "Apply as Pathfinder — TİSYA", description: "Apply as a Pathfinder (Member) and join the core of the TİSYA Alliance." },
  ambassador: { title: "Apply as Ambassador — TİSYA", description: "Apply to represent TİSYA in your country, campus, or community." },
  partner: { title: "Apply as Partner — TİSYA", description: "Apply to partner with or sponsor the TİSYA Alliance." },
};

const JoinPage = () => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [role]);

  if (!isJoinRole(role)) {
    navigate("/", { replace: true });
    return null;
  }

  const handleBack = () => navigate("/");

  const renderForm = () => {
    switch (role) {
      case "opportunists":
        return <OpportunistForm onBack={handleBack} />;
      case "members":
        return <PathfinderForm onBack={handleBack} />;
      case "ambassador":
        return <AmbassadorForm onBack={handleBack} />;
      case "partner":
        return <PartnerSponsorForm onBack={handleBack} />;
    }
  };

  const meta = JOIN_META[role];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <SEO title={meta.title} description={meta.description} path={`/join/${role}`} />
      {renderForm()}
    </motion.div>
  );
};

export default JoinPage;
