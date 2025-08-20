import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Home, ListTodo, LogOut, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { label: "Tasks", icon: <ListTodo size={20} />, path: "/tasks" },
    { label: "Events", icon: <Calendar size={20} />, path: "/events" },
  ];

  const getInitials = (name) => {
    if (!name) return "UN";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[1][0];
    }
    return names[0].slice(0, 2);
  };

  return (
    <Sidebar collapsible="icon" className="bg-[#F7FAFC] border-r border-gray-200 min-h-screen w-64 p-4 flex flex-col">
      <SidebarContent className="flex flex-col flex-1">
        <div className="flex flex-col items-center py-6">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback className="text-2xl bg-purple-200 text-purple-700">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <p className="font-bold text-purple-700 text-lg">{user?.name || "User"}</p>
        </div>
        <SidebarMenu className="flex-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path} className="mb-3">
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith(item.path)}
                className={`w-full justify-start transition-colors duration-200 ease-in-out
                  ${location.pathname.startsWith(item.path)
                    ? "bg-[#6B46C1] text-white"
                    : "text-gray-600 hover:bg-purple-100"
                  }`}
              >
                <a href={item.path} onClick={e => { e.preventDefault(); navigate(item.path); }} className="flex items-center gap-4 px-4 py-2">
                  {item.icon}
                  <span className="text-base">{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="mt-auto">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-purple-700 gap-4 px-4 py-2"
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </SidebarContent>
      {/* Hamburger menu for mobile */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <SidebarTrigger>
          <Menu className="text-[#6B46C1]" />
        </SidebarTrigger>
      </div>
    </Sidebar>
  );
}
