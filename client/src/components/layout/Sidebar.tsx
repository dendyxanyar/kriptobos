import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Info, 
  Mail, 
  Settings, 
  ChevronDown,
  Wallet,
  History,
  Activity
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { 
    icon: Home, 
    label: "Home", 
    href: "/",
    subItems: [
      { icon: Wallet, label: "Dashboard", href: "/dashboard" },
      { icon: History, label: "History", href: "/history" },
      { icon: Activity, label: "Analytics", href: "/analytics" }
    ]
  },
  { icon: Activity, label: "Resolv Checker", href: "/resolv" },
  { icon: Info, label: "About", href: "/about" },
  { icon: Mail, label: "Contact", href: "/contact" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [location] = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.label);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = location === item.href;

    return (
      <div key={item.href} className="mb-1">
        <Link href={item.href}>
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer",
              "transition-colors duration-200",
              level === 0 ? "hover:bg-primary/10" : "hover:bg-primary/5",
              isActive && "bg-primary/10 text-primary",
              level > 0 && "ml-6 text-sm"
            )}
            onClick={(e) => {
              if (hasSubItems) {
                e.preventDefault();
                toggleExpand(item.label);
              }
            }}
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1">{item.label}</span>
            {hasSubItems && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "transform rotate-180"
                )}
              />
            )}
          </div>
        </Link>
        {hasSubItems && isExpanded && (
          <div className="mt-1">
            {item.subItems!.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 md:hidden z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 20 }}
        className={cn(
          "fixed left-0 top-0 bottom-0 w-64 bg-background border-r z-50",
          "md:relative md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center border-b">
            <Logo />
            <ThemeToggle />
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};