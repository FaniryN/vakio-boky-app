import { motion } from 'framer-motion';

export default function Apropos() {
    
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
    >
      {/* Image */}
      <div className="h-48 bg-gray-200 relative">
        <p>Vakio Boky Initiative...</p>
      </div>
    </motion.div>
  );
}