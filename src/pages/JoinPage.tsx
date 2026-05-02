import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import OpportunistForm from "@/components/OpportunistForm";
import PathfinderForm from "@/components/PathfinderForm";
import AmbassadorForm from "@/components/AmbassadorForm";
import CountryUnionForm from "@/components/CountryUnionForm";
import PartnerSponsorForm from "@/components/PartnerSponsorForm";

type JoinRole = "opportunists" | "members" | "ambassador" | "countryunion" | "partner";

const isJoinRole = (v: string | undefined): v is JoinRole =>
  v === "opportunists" || v === "members" || v === "ambassador" || v === "countryunion" || v === "partner";

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
      case "countryunion":
        return <CountryUnionForm onBack={handleBack} />;
      case "partner":
        return <PartnerSponsorForm onBack={handleBack} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {renderForm()}
    </motion.div>
  );
};

export default JoinPage;
