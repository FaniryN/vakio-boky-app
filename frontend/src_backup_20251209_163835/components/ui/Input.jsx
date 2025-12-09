import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import PropTypes from "prop-types";

export default function Input({
  variant = "primary",
  size = "md",
  placeholder = "Rechercher...",
  value,
  onChange,
  icon = <FiSearch />,
}) {
  // Variants styles pour Tailwind
  const variantClasses = {
    primary:
      "bg-white border border-blue-400 text-blue-900 placeholder:text-blue-400",
    outline:
      "bg-transparent border border-blue-500 text-blue-900 placeholder:text-blue-500",
    secondary:
      "bg-gray-100 border border-gray-300 text-gray-900 placeholder:text-gray-500",
  };

  const sizeClasses = {
    sm: "px-2 py-1 w-40 md:w-48",
    md: "px-3 py-2 w-48 md:w-64",
    lg: "px-4 py-2 w-64 md:w-80",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center rounded-md ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="outline-none w-full bg-transparent text-sm"
      />
      <button type="submit" className="flex items-center">
        {icon && <span className="ml-2 cursor-pointer">{icon}</span>}
      </button>
    </motion.div>
  );
}

// PropTypes pour plus de sécurité
Input.propTypes = {
  variant: PropTypes.oneOf(["primary", "outline", "secondary"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  icon: PropTypes.element,
};
