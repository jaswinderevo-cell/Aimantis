"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { COLOR_ATHENS_GRAY, COLOR_LIGHT_BLUE } from "@/constants/constants";
import { Bell, CreditCard, FileText } from "lucide-react";
import { useEffect } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbDashboard } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
import DashboardTab from "./DashboardTab";

export default function Invoicing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  // set a default tab
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "dashboard" });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (newTabs: string) => {
    setSearchParams({ tab: newTabs });
  };
  return (
    <div
      className={`min-h-screen px-[24px] py-[30px]`}
      style={{ backgroundColor: COLOR_LIGHT_BLUE }}
    >
      <div className="w-full h-full">
        <Tabs
          defaultValue="dashboard"
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-[24px]"
        >
          {/* Tabs buttons */}
          <TabsList
            className="grid w-full h-[40px] grid-cols-5"
            style={{ backgroundColor: COLOR_ATHENS_GRAY }}
          >
            <TabsTrigger
              value="dashboard"
              className="flex items-center justify-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <TbDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>

            <TabsTrigger
              value="documenti"
              className="flex items-center justify-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <IoDocumentTextOutline size={16} />
              <span className="hidden sm:inline">Documenti</span>
            </TabsTrigger>
            <TabsTrigger
              value="clienti"
              className="flex items-center justify-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <CreditCard size={16} />
              <span className="hidden sm:inline">Clienti</span>
            </TabsTrigger>

            <TabsTrigger
              value="prodotti"
              className="flex items-center justify-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Prodotti</span>
            </TabsTrigger>

            <TabsTrigger
              value="impostazioni"
              className="flex items-center justify-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <Bell size={16} />
              <span className="hidden sm:inline">Impostazioni</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardTab />
          </TabsContent>

          {/* Documenti Tab */}
          <TabsContent value="documenti"></TabsContent>

          {/* Clienti Tab */}
          <TabsContent value="clienti" className="space-y-6"></TabsContent>

          {/* Prodotti Tab */}
          <TabsContent value="prodotti" className="space-y-6"></TabsContent>

          {/* Impostazioni Tab */}
          <TabsContent value="impostazioni" className="space-y-6"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
