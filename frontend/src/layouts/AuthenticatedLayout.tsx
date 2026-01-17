import Header from "@/components/AppHeaders";
import SidebarComp from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/Sidebar";
import { ROUTES } from "@/constants/routes";
import { useLogout } from "@/services/auth";
import { useGetSingleBooking } from "@/services/bookings";
import { useBreadCrumbs } from "@/utils/helper";
import { useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

export default function DashboardLayout() {
  const logout = useLogout();
  const breadCrumbs = useBreadCrumbs();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { id } = useParams();

  const getSingleBooking = useGetSingleBooking(Number(id));
  const singleBookingData = getSingleBooking?.data || {};
  const location = useLocation();
  const fromFrontDesk = location.state?.fromFrontDesk === true;

  const navigate = useNavigate();
  
  const handleNavigate = () => {
    if (fromFrontDesk) {
      navigate(ROUTES.FRONT_DESK);
    } else {
      navigate(ROUTES.BOOKINGS_AND_CHECKINS);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <SidebarComp
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        closeMobileMenu={closeMobileMenu}
      />

      <div className="lg:ml-[118px] flex flex-col min-h-screen lg:w-[calc(100%-118px)] w-[calc(100%)]">
        <SidebarInset>
          {/* Header */}
          <Header
            breadCrumbs={breadCrumbs}
            singleBooking={singleBookingData || null}
            handleNavigate={handleNavigate}
            toggleMobileMenu={toggleMobileMenu}
            logout={logout}
          />

          {/*Dashboard pages*/}
          <main className="lg:pt-0 sm:ml-[0px] lg:mt-0 mt-16">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
