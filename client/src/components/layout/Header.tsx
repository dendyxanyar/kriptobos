import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { motion } from "framer-motion";

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
  breadcrumb: string[];
}

export const Header = ({ toggleSidebar, title, breadcrumb }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            {title}
          </h1>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            {breadcrumb.map((item, index) => (
              <motion.span
                key={item}
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {index > 0 && <span className="mx-2">›</span>}
                {item}
              </motion.span>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};