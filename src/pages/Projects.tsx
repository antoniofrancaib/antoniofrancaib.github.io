import { Navigation } from "@/components/Navigation";
import { Projects as ProjectsComponent } from "@/components/Projects";

const Projects = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />
      <ProjectsComponent />
    </div>
  );
};

export default Projects;