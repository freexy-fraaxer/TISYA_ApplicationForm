import { motion, AnimatePresence } from "framer-motion";

interface StepFeedbackProps {
  message: string;
  show: boolean;
}

const StepFeedback = ({ message, show }: StepFeedbackProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="text-center py-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="text-sm text-primary/80 font-medium">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StepFeedback;
