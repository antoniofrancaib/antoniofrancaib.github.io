import { Blog as BlogComponent } from "@/components/Blog";
import { Navigation } from "@/components/Navigation";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BlogComponent />
    </div>
  );
};

export default Blog;