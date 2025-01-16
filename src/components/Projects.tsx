import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export const Projects = () => {
  const projects = [
    {
      title: "Enhancing Memory Storage in Neuronal Networks",
      description: "Project developed as part of my research internship supervised by Dr Alex Roxin at CRM Barcelona, and Prof Daniele Avitabile at VU Amsterdam, Spring 2024.",
      image: "/lovable-uploads/4e6d40df-bfbb-42c6-8c60-b0f13acaf65f.png",
      links: {
        github: "https://github.com/antoniofrancaib/quenched-variability-role",
        project: "../assets/pdf/quenched-variability-role.pdf"
      }
    },
    {
      title: "Segmenting Glomeruli Functional Tissue Units",
      description: "Project developed as part of the final project for the Machine Learning (CZ4041) class by Prof Ke Yiping, Kelly at NTU Singapore, Fall 2023.",
      image: "/lovable-uploads/e8485e54-54e6-4ac4-9cd2-34c8ac86872f.png",
      links: {
        github: "https://github.com/antoniofrancaib/hacking-the-kidney/tree/main",
        project: "../assets/pdf/hacking-kidney.pdf"
      }
    },
    {
      title: "Cross-Domain Sentiment Classification",
      description: "Project developed as part of the final project for the Deep Learning & Neural Networks (CZ4042) class by Prof Jagath Rajapakse at NTU Singapore, Fall 2023.",
      image: "/lovable-uploads/7188c766-e31d-4cc0-883a-3bd4323328dd.png",
      links: {
        project: "../assets/pdf/cross-domain.pdf",
        notes: "../assets/pdf/dl-notes.pdf"
      }
    },
    {
      title: "On the Amari Neural Field Equation",
      description: "Project developed as part of an independent study supervised by Prof Daniele Avitabile at VU Amsterdam, Spring 2022.",
      image: "/lovable-uploads/443baf7b-ceb7-4978-89ac-a31c436f0283.png",
      links: {
        project: "../assets/pdf/math-neuroscience.pdf"
      }
    }
  ];

  return (
    <section className="py-20 bg-muted" id="projects">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-primary mb-4">Publications</h2>
          <p className="text-lg text-muted-foreground mb-12">Some of the projects I worked on.</p>
          
          <div className="grid grid-cols-1 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={project.image}
                        alt={`${project.title} Project Image`}
                        className="w-full h-48 object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4 flex-wrap">
                          {project.links.github && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" />
                                GitHub
                              </a>
                            </Button>
                          )}
                          {project.links.project && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.links.project} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Project
                              </a>
                            </Button>
                          )}
                          {project.links.notes && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.links.notes} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Notes
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};