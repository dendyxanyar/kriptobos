import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb: string[];
}

export const Layout = ({ children, title, breadcrumb }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Changed to true by default

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        title={title}
        breadcrumb={breadcrumb}
      />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6"
        >
          {children}
        </motion.main>
      </div>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        © 2025 My Web3 Site. All rights reserved.
      </footer>
    </div>
  );
};