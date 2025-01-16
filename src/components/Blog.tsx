import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

export const Blog = () => {
  const posts = [
    {
      id: "dont-break-your-windows",
      title: "Don't Break Your Windows",
      icon: Brain,
      date: "December, 2024"
    }
  ];

  return (
    <section className="py-20 bg-white" id="blog">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-primary mb-12">Latest Posts</h2>
          <div className="grid gap-8">
            {posts.map((post) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-muted hover:shadow-lg transition-shadow"
              >
                <Link 
                  to={`/blog/${post.id}`} 
                  className="flex items-start gap-4 group"
                >
                  <post.icon className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};