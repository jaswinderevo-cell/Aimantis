import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Bell, CreditCard, FileText, Settings, Shield } from "lucide-react";
import { FaRegUser } from "react-icons/fa6";

import {
  COLOR_ATHENS_GRAY,
  COLOR_LIGHT_BLUE,
} from "@/constants/constants";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BillingTab from "./BillingTab";
import InvoicesTab from "./InvoicesTab";
import NotificationsTab from "./NotificationsTab";
import Preferences from "./Preferences";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";

const AccountsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  // set a default tab
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "profile" });
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
          defaultValue="profile"
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-[24px]"
        >
          {/* Tabs buttons */}
          <TabsList
            className="grid w-full h-[40px] grid-cols-6"
            style={{ backgroundColor: COLOR_ATHENS_GRAY }}
          >
            <TabsTrigger
              value="profile"
              className="flex items-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <FaRegUser size={16} />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="flex items-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <Shield size={16} />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>

            <TabsTrigger
              value="billing"
              className="flex items-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <CreditCard size={16} />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>

            <TabsTrigger
              value="invoices"
              className="flex items-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Invoices</span>
            </TabsTrigger>

            <TabsTrigger
              value="notifications"
              className="flex items-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <Bell size={16} />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>

            <TabsTrigger
              value="preferences"
              className="flex items-center h-[32px] gap-2 text-[13px] font-medium text-[#6B7280] data-[state=active]:text-[#111827] data-[state=active]:shadow-[0px_0px_5px_0_#D3D3D3]"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileTab />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <BillingTab />
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <InvoicesTab />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <NotificationsTab />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Preferences />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountsPage;
