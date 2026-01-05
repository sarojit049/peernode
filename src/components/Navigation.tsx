"use client";

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Search, User } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/smart-matching", icon: Home },
    { name: "Pods", path: "/smart-matching", icon: Users },
    { name: "AI Search", path: "/ai-search", icon: Search },
    { name: "Profile", path: "/academic-profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center justify-center h-16 w-16 rounded-lg ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-500"
              }`}
              asChild
            >
              <Link to={item.path}>
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;