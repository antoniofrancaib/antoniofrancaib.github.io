import { motion } from "framer-motion";

export const About = () => {
  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center md:block">
        {/* Top section with image and titles (centered) */}
        <div className="flex flex-col items-center mb-8 md:mb-12 md:float-left md:w-2/5 md:mr-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <img
              src="/lovable-uploads/a491ad23-e401-4749-af51-70848695f435.png"
              alt="Profile"
              className="w-64 h-96 object-cover shadow-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold mb-2">
              Machine Learning at Cambridge University
            </h2>
            <p className="text-base text-gray-600 italic">
              Striving to exploit the plasticity of the human brain
            </p>
          </motion.div>
        </div>

        {/* Text content that will wrap around the image on desktop */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full"
        >
          <div className="prose prose-lg max-w-none text-justify">
            <p>
              I am Antonio, an MPhil student in Machine Learning and Machine Intelligence at Cambridge University. Before starting my master's, I completed a BSc in Mathematics at VU Amsterdam, where I worked on my thesis in collaboration with CRM Barcelona, researching how variability in synaptic connectivity can enhance the memory storage capabilities of recurrent neural networks (CA3 region of the hippocampus). I also completed a research internship at Artificial Neural Computing, focusing on modeling the boundary dynamics of neural networks. Additionally, I co-founded altan.ai, a startup aimed at automating workflows using AI, and I had the opportunity to teach courses in Single Variable Calculus, Probability Theory, and Linear Algebra as a Teaching Assistant at VU Amsterdam.
            </p>
            <p>
              I am interested in exploring the computational principles of natural and artificial intelligence, aiming to "reverse engineer" the brain's algorithms, both to learn about how our brains work and to build more effective AI systems. In the long term, my goal is to leverage AI to help people gain greater agency over their circumstances and reach their full potential. I particularly want to focus my research on areas such as neural representations and computational dynamics in the brain, learning algorithms that enable continual and efficient skill acquisition, meta-learning and online learning frameworks, understanding the theoretical underpinnings of deep learning, studying knowledge representation and hierarchical abstraction in neural networks, and advancing reinforcement learning techniques for adaptive behavior.
            </p>
            <p>
              To recharge my batteries, I spend time outdoors running, working out, surfing, rock climbing, boxing, making and playing music, traveling, reading and hanging out with friends.
            </p>
            <p className="font-bold">
              NEWS: I will be applying for PhD positions for the Fall 2025 admit!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};