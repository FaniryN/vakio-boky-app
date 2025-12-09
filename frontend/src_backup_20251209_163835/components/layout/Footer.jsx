import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='relative bg-blue-50 border-t-4 border-blue-500/40 backdrop-blur-sm rounded-t-2xl shadow-inner mt-12'>
      <div className='container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4 md:gap-0'>
        {/* --- Texte de copyright avec animation --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-gray-800 font-serif text-sm md:text-base italic'
        >
          © {new Date().getFullYear()} Vakio Boky Initiative — Tous droits
          réservés
        </motion.div>

        {/* --- Liens sociaux stylés avec animation --- */}
        <motion.div
          className='flex items-center gap-6'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* --- Liens sociaux avec icônes --- */}
          <motion.div
            className='flex items-center gap-6'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              to='#'
              className='text-blue-700 hover:text-blue-500 transition-colors duration-300'
              aria-label='Facebook'
            >
              <FaFacebookF size={20} />
            </Link>
            <Link
              to='#'
              className='text-blue-700 hover:text-blue-500 transition-colors duration-300'
              aria-label='Twitter'
            >
              <FaTwitter size={20} />
            </Link>
            <Link
              to='#'
              className='text-blue-700 hover:text-blue-500 transition-colors duration-300'
              aria-label='Instagram'
            >
              <FaInstagram size={20} />
            </Link>
          </motion.div>
        </motion.div>

        {/* --- Petit slogan ou citation de livres --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className='text-gray-700 font-serif text-sm md:text-base italic mt-2 md:mt-0'
        >
          « Plongez dans le monde des mots et des histoires. »
        </motion.div>
      </div>
    </footer>
  );
}
