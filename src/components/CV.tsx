import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Award, FileDown, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CV = () => {
  return (
    <section className="py-20 bg-white" id="cv">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Curriculum Vitae</h2>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => window.open('https://antoniofrancaib.github.io/assets/pdf/cv.pdf', '_blank')}
            >
              <FileDown className="w-4 h-4" />
              Download CV
            </Button>
          </div>
          
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-semibold">Education</h3>
              </div>
              <div className="space-y-6">
                <div className="pl-8 border-l-2 border-accent">
                  <h4 className="text-lg font-semibold">MPhil in Machine Learning and Machine Intelligence</h4>
                  <p className="text-gray-600">University of Cambridge</p>
                  <p className="text-gray-500">Oct 2024 - Present</p>
                  <ul className="list-disc list-inside text-gray-600 mt-2">
                    <li>Member of the Department of Engineering, Queens' College</li>
                    <li>Courses: Reinforcement Learning, Deep Learning & Structured Data, Probabilistic Machine Learning, Geometric Deep Learning, Computational Neuroscience</li>
                  </ul>
                </div>
                <div className="pl-8 border-l-2 border-accent">
                  <h4 className="text-lg font-semibold">BSc in Mathematics (Cum Laude)</h4>
                  <p className="text-gray-600">Vrije Universiteit Amsterdam</p>
                  <p className="text-gray-500">Sept 2021 - June 2024</p>
                  <ul className="list-disc list-inside text-gray-600 mt-2">
                    <li>Graduated in top 2% of cohort</li>
                    <li>Honors Program with additional 30 ECTS in advanced Computer Science</li>
                  </ul>
                </div>
                <div className="pl-8 border-l-2 border-accent">
                  <h4 className="text-lg font-semibold">Exchange Semester in Artificial Intelligence</h4>
                  <p className="text-gray-600">Nanyang Technological University</p>
                  <p className="text-gray-500">Aug 2023 - Dec 2023</p>
                  <p className="text-gray-600 mt-2">GLOBE scholar - Merit-based scholarship</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-semibold">Research Experience</h3>
              </div>
              <div className="space-y-6">
                <div className="pl-8 border-l-2 border-accent">
                  <h4 className="text-lg font-semibold">Bachelor's Thesis Research</h4>
                  <p className="text-gray-600">Centre de Recerca Matemàtica (CRM)</p>
                  <p className="text-gray-500">Feb 2024 - Aug 2024</p>
                  <p className="text-gray-600 mt-2">Researched synaptic connectivity in recurrent neural networks, focusing on memory storage capabilities in the CA3 region of the hippocampus</p>
                </div>
                <div className="pl-8 border-l-2 border-accent">
                  <h4 className="text-lg font-semibold">Research Intern</h4>
                  <p className="text-gray-600">Artificial Neural Computing (ANC)</p>
                  <p className="text-gray-500">Jan 2022 - May 2022</p>
                  <p className="text-gray-600 mt-2">Studied advanced ML topics and conducted research on neural network boundary dynamics</p>
                </div>
                <div className="pl-8 border-l-2 border-accent">
                  <h4 className="text-lg font-semibold">Machine Learning Safety Scholar</h4>
                  <p className="text-gray-600">Center for AI Safety (CAIS)</p>
                  <p className="text-gray-500">Jun 2021 - Sept 2021</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-semibold">Leadership & Teaching</h3>
              </div>
              <div className="space-y-6">
                <div className="pl-8 border-l-2 border-accent">
                  <h4 className="text-lg font-semibold">Founding Engineer</h4>
                  <p className="text-gray-600">Altan.ai</p>
                  <p className="text-gray-500">Jan 2022 - January 2023</p>
                  <p className="text-gray-600 mt-2">Developed multi-armed bandit algorithms and chatbot integration platforms</p>
                </div>
                <div className="pl-8 border-l-2 border-accent">
                  <h4 className="text-lg font-semibold">Teaching Assistant</h4>
                  <p className="text-gray-600">VU Amsterdam</p>
                  <p className="text-gray-500">Sept 2022 - Jun 2023</p>
                  <p className="text-gray-600 mt-2">Led sessions in Probability Theory, Calculus, and Linear Algebra</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Code className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-semibold">Skills & Technologies</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 pl-8">
                <div>
                  <h4 className="font-semibold mb-2">Programming Languages</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Python, JavaScript, C/C++</li>
                    <li>Scala, Spark, Kotlin</li>
                    <li>SQL, HTML, CUDA</li>
                    <li>VHDL, MIPS assembly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">ML & Neural Networks</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>PyTorch, JAX, TensorFlow</li>
                    <li>PyTorch Lightning</li>
                    <li>Weights and Biases</li>
                    <li>NEST, Brian, NEURON</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-semibold">Selected Honors</h3>
              </div>
              <div className="space-y-4 pl-8">
                <div>
                  <h4 className="font-semibold">Cum Laude Distinction (2024)</h4>
                  <p className="text-gray-600">Top 2% of BSc Mathematics cohort</p>
                </div>
                <div>
                  <h4 className="font-semibold">CRM Fellowship Award (2024)</h4>
                  <p className="text-gray-600">Research grant in computational neuroscience</p>
                </div>
                <div>
                  <h4 className="font-semibold">GLOBE Scholarship (2023)</h4>
                  <p className="text-gray-600">Awarded to top 1% of students at VU Amsterdam</p>
                </div>
                <div>
                  <h4 className="font-semibold">Long-Term Future Fund Grant (2022)</h4>
                  <p className="text-gray-600">Personal grant for Machine Learning projects</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};