import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <motion.div 
      className="flex items-center justify-center h-16 w-16"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-10 w-10 fill-current text-primary"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-current"
        />
      </svg>
    </motion.div>
  );
};
