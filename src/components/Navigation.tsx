import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary">Antonio</Link>
          <div className="flex space-x-8">
            <Link to="/#about" className="text-gray-600 hover:text-primary transition-colors">About</Link>
            <Link to="/blog" className="text-gray-600 hover:text-primary transition-colors">Blog</Link>
            <Link to="/projects" className="text-gray-600 hover:text-primary transition-colors">Projects</Link>
            <Link to="/cv" className="text-gray-600 hover:text-primary transition-colors">CV</Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};