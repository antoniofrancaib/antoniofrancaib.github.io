import { motion } from "framer-motion";
import { Brain, Network, Lightbulb, Code } from "lucide-react";

const interests = [
  {
    icon: Brain,
    title: "Neural Representations",
    description: "Studying computational dynamics in the brain and neural networks",
  },
  {
    icon: Network,
    title: "Learning Algorithms",
    description: "Developing frameworks for continual and efficient skill acquisition",
  },
  {
    icon: Lightbulb,
    title: "Meta-Learning",
    description: "Advancing online learning frameworks and adaptive behavior",
  },
  {
    icon: Code,
    title: "Deep Learning Theory",
    description: "Understanding theoretical underpinnings and knowledge representation",
  },
];

export const Research = () => {
  return (
    <section className="py-20 bg-white" id="research">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-primary mb-12">Research Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-muted hover:shadow-lg transition-shadow"
              >
                <interest.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">{interest.title}</h3>
                <p className="text-gray-600">{interest.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};