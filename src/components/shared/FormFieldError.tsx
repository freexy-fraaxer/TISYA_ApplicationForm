import { motion, AnimatePresence } from "framer-motion";

interface FormFieldErrorProps {
  error: string | null;
}

const FormFieldError = ({ error }: FormFieldErrorProps) => {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          className="text-xs text-destructive mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

export default FormFieldError;
