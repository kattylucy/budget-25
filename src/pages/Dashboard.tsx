import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wallet, BookOpen, Calendar, Calculator, 
  Users, Briefcase, LogOut
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { clearAuthentication, isAuthenticated } from "../utils/authUtils";
import ExpensesPage from "@/components/expenses/ExpensesPage";
import HistoryPage from "@/components/HistoryPage";
import RecurrentExpensesPage from "@/components/recurrent-expenses/RecurrentExpensesPage";
import CalculationsPage from "@/components/calculations/CalculationsPage";
import SharedExpensesPage from "@/components/shared-expenses/SharedExpensesPage";
import WorkPage from "@/components/work/WorkPage";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";

export const CurrencyContext = React.createContext<{
  displayCurrency: string;
  setDisplayCurrency: (currency: string) => void;
}>({
  displayCurrency: "EUR",
  setDisplayCurrency: () => {},
});

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("expenses");
  const navigate = useNavigate();
  const isMobile = useIsMobile();


  React.useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login first");
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuthentication();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navItems = [
    {
      name: "Expenses",
      icon: Wallet,
      onClick: () => setActiveSection("expenses"),
      active: activeSection === "expenses",
    },
    {
      name: "Recurring",
      icon: Calendar,
      onClick: () => setActiveSection("recurring"),
      active: activeSection === "recurring",
    },
    {
      name: "History",
      icon: BookOpen,
      onClick: () => setActiveSection("history"),
      active: activeSection === "history",
    },
    {
      name: "Calculator",
      icon: Calculator,
      onClick: () => setActiveSection("calculator"),
      active: activeSection === "calculator",
    },
    {
      name: "Shared",
      icon: Users,
      onClick: () => setActiveSection("shared"),
      active: activeSection === "shared",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "expenses":
        return <ExpensesPage />;
      case "recurring":
        return <RecurrentExpensesPage />;  
      case "history":
        return <HistoryPage />;
      case "calculator":
        return <CalculationsPage />;
      case "shared":
        return <SharedExpensesPage />;
      case "work":
        return <WorkPage />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Select an option from the menu</p>
          </div>
        );
    }
  };

  return (
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-white">
          <AppSidebar 
            navItems={navItems} 
            handleLogout={handleLogout}
          />
          
          <main className="flex-1 p-2 sm:p-4 pb-16 overflow-auto">
            <div className="container mx-auto max-w-4xl">
              <header className="flex justify-between items-center mb-4 sm:mb-6 mt-2">
                <div className="flex items-center">
                  {isMobile && <SidebarTrigger className="mr-2" />}
                </div>
              </header>

              <div className="relative z-10 pb-4">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
  );
};

interface AppSidebarProps {
  navItems: {
    name: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    active: boolean;
  }[];
  handleLogout: () => void;
}

const AppSidebar = ({ navItems, handleLogout }: AppSidebarProps) => {
  const { isMobile } = useSidebar();
  
  return (
    <Sidebar variant={isMobile ? "floating" : "sidebar"}>
      <SidebarContent>
        <div className="p-4">
          <Logo />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    onClick={item.onClick}
                    isActive={item.active}
                    tooltip={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default Dashboard;
