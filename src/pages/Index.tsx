import { About } from "@/components/About";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <About />
    </div>
  );
};

export default Index;