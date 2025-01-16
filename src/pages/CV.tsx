import { Navigation } from "@/components/Navigation";
import { CV as CVComponent } from "@/components/CV";

const CV = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />
      <CVComponent />
    </div>
  );
};

export default CV;