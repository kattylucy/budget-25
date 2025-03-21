import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wallet, BookOpen, Calendar, Calculator, 
  Users, DollarSign, Euro, Briefcase, LogOut
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [displayCurrency, setDisplayCurrency] = useState(() => {
    return localStorage.getItem("preferredCurrency") || "EUR";
  });
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    localStorage.setItem("preferredCurrency", displayCurrency);
  }, [displayCurrency]);

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
    {
      name: "Work",
      icon: Briefcase,
      onClick: () => setActiveSection("work"),
      active: activeSection === "work",
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
    <CurrencyContext.Provider value={{ displayCurrency, setDisplayCurrency }}>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-white">
          <AppSidebar 
            navItems={navItems} 
            displayCurrency={displayCurrency} 
            setDisplayCurrency={setDisplayCurrency}
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
    </CurrencyContext.Provider>
  );
};

interface AppSidebarProps {
  navItems: {
    name: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    active: boolean;
  }[];
  displayCurrency: string;
  setDisplayCurrency: (currency: string) => void;
  handleLogout: () => void;
}

const AppSidebar = ({ navItems, displayCurrency, setDisplayCurrency, handleLogout }: AppSidebarProps) => {
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
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      <div className="flex items-center">
                        {displayCurrency === "EUR" ? (
                          <Euro className="h-5 w-5 mr-2" />
                        ) : (
                          <DollarSign className="h-5 w-5 mr-2" />
                        )}
                        <span>Currency</span>
                      </div>
                      <span className="text-gray-500">{displayCurrency}</span>
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-0">
                    <div className="py-1">
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          displayCurrency === "EUR" ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => setDisplayCurrency("EUR")}
                      >
                        <div className="flex items-center">
                          <Euro className="h-4 w-4 mr-2" />
                          <span>Euro (€)</span>
                        </div>
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          displayCurrency === "USD" ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => setDisplayCurrency("USD")}
                      >
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>US Dollar ($)</span>
                        </div>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
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
