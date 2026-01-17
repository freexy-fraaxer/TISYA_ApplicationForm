import { motion } from "framer-motion";

interface HelperTextProps {
  children: React.ReactNode;
  className?: string;
}

const HelperText = ({ children, className = "" }: HelperTextProps) => {
  return (
    <motion.p
      className={`text-xs text-muted-foreground/70 mt-1.5 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      {children}
    </motion.p>
  );
};

export default HelperText;
