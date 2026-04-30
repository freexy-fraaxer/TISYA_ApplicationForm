import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import OperatorsForm from "@/components/OpportunistForm";
import MemberForm from "@/components/MemberForm";
import AmbassadorForm from "@/components/AmbassadorForm";
import CountryUnionForm from "@/components/CountryUnionForm";
import PartnerSponsorForm from "@/components/PartnerSponsorForm";

type JoinRole = "operators" | "members" | "ambassador" | "countryunion" | "partner";

const isJoinRole = (v: string | undefined): v is JoinRole =>
  v === "operators" || v === "members" || v === "ambassador" || v === "countryunion" || v === "partner";

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
      case "operators":
        return <OperatorsForm onBack={handleBack} />;
      case "members":
        return <MemberForm onBack={handleBack} />;
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
