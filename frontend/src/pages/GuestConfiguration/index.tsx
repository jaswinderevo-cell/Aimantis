import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { COLOR_ATHENS_GRAY, COLOR_LIGHT_BLUE } from "@/constants/constants";
import { FileText } from "lucide-react";
import { useEffect } from "react";
import { MdOutlineConnectedTv, MdOutlineLocalPolice } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import OnlineCheckin from "./OnlineCheckin";

export default function GuestConfiguration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "online-checkin";

  // set a default tab
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "online-checkin" });
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
          defaultValue="online-checkin"
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-[24px]"
        >
          {/* Tabs buttons */}
          <TabsList
            className="grid w-full h-[40px] grid-cols-3"
            style={{ backgroundColor: COLOR_ATHENS_GRAY }}
          >
            <TabsTrigger
              value="online-checkin"
              className="flex items-center justify-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <MdOutlineLocalPolice size={16} />
              <span className="hidden sm:inline">Online Check In</span>
            </TabsTrigger>

            <TabsTrigger
              value="communication"
              className="flex items-center justify-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <MdOutlineConnectedTv size={16} />
              <span className="hidden sm:inline">Communication</span>
            </TabsTrigger>

            <TabsTrigger
              value="guest-guide"
              className="flex items-center justify-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Guest guide</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent
            value="online-checkin"
            className="space-y-6"
          > <OnlineCheckin/> </TabsContent>

          {/* Documenti Tab */}
          <TabsContent value="communication"></TabsContent>

          {/* Clienti Tab */}
          <TabsContent value="guest-guide" className="space-y-6"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
