import {
  COLOR_ATHENS_GRAY,
  COLOR_LIGHT_GRAY,
  COLOR_VIOLET,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { sidebarVariants } from "@/utils/animation";
import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { HiOutlineDocumentCurrencyDollar, HiOutlineKey } from "react-icons/hi2";
import { LuHouse, LuSquareUserRound, LuUserRoundCheck } from "react-icons/lu";
import { RiAttachmentLine } from "react-icons/ri";
import {
  TbBed,
  TbBuilding,
  TbBuildingEstate,
  TbClipboardList,
  TbIdBadge,
  TbTaxEuro,
  TbTool,
  TbUserCheck,
} from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { GrCopy } from "react-icons/gr";
import { ReceiptEuro } from "lucide-react";
import { useGetMyProfile } from "@/services/myAccount";
import { getInitials } from "@/utils/helper";

// menu items
const items = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: LuHouse,
  },
  {
    title: "Front Desk",
    url: ROUTES.FRONT_DESK,
    icon: FaRegPenToSquare,
  },
  {
    title: "Rate",
    url: ROUTES.RATES,
    icon: HiOutlineDocumentCurrencyDollar,
  },
  {
    title: "Reservations",
    url: ROUTES.BOOKINGS_AND_CHECKINS,
    icon: LuUserRoundCheck,
  },
  {
    title: "City Tax",
    url: ROUTES.CITY_TAX,
    icon: TbTaxEuro,
  },
  {
    title: "ISTAT",
    url: ROUTES.ISTAT,
    icon: GrCopy,
  },
  {
    title: "Invoicing",
    url: ROUTES.INVOICING,
    icon: ReceiptEuro,
  },
  {
    title: "Properties",
    url: "#",
    icon: TbBuildingEstate,
    children: [
      {
        title: "Structures",
        icon: TbBuilding,
        url: ROUTES.STRUCTURES,
      },
      {
        title: "Property Types",
        icon: TbClipboardList,
        url: ROUTES.PROPERTY_TYPES,
      },
      {
        title: "Rooms",
        icon: TbBed,
        url: ROUTES.PROPERTIES,
      },
      {
        title: "Structure Users",
        icon: TbUserCheck,
        url: ROUTES.STRUCTURE_USERS,
      },
    ],
  },
  {
    title: "Configuration",
    url: "#",
    icon: TbTool,
    children: [
      {
        title: "Portals",
        icon: RiAttachmentLine,
        url: ROUTES.PORTALS,
      },
      {
        title: "API keys",
        icon: HiOutlineKey,
        url: "#",
      },
      {
        title: "Bureaucracy",
        icon: TbIdBadge,
        url: ROUTES.BUREAUCRACY,
      },
    ],
  },
  {
    title: "Global User Management",
    icon: TbUserCheck,
    url: ROUTES.USER_MANAGEMENT,
  },
  {
    title: "Guest Experience",
    icon: LuSquareUserRound,
    url: ROUTES.GUEST_CONFIGURATION,
  },
];

type SideBarProps = {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
};

const SidebarComp = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
}: SideBarProps) => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const location = useLocation();

  const { data: myProfile } = useGetMyProfile();
  const companyName = myProfile?.data?.company;
  const companyLogo = myProfile?.data?.company_logo_url;

  // close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex sidebar-container bg-white w-[120px] border-r-2 border-blue-50 flex-col items-center fixed top-0 left-0 h-screen z-30">
      {/* logo */}
      <div className="w-full flex items-center justify-center h-[79px]">
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={companyName || "Company Logo"}
            className="w-10 h-10 object-cover rounded shadow tracking-wide select-none"
            style={{ borderColor: COLOR_ATHENS_GRAY }}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width="40"
            height="40"
          />
        ) : (
          <h2 className="logo font-extrabold text-[24px] tracking-wide select-none">
            {companyName &&
              (companyName.length > 5
                ? getInitials(companyName)
                : companyName.toUpperCase())}
          </h2>
        )}
      </div>

      {/* nav */}
      <div className="overflow-auto scr w-full flex-1 scr">
        <nav className="flex flex-col gap-2 w-full items-center">
          {items.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus.includes(item.title);
            const isActive = location.pathname === item.url;

            return (
              <div key={item.title} className="w-full">
                {hasChildren ? (
                  <div
                    onClick={() => toggleMenu(item.title)}
                    className="flex flex-col border-t items-center gap-1 py-4 w-full cursor-pointer transition-colors duration-200 hover:bg-blue-100 hover:text-black"
                  >
                    {!isOpen && <Icon className="text-gray-500" size={22} />}
                    <span
                      className={`text-[14px] ${
                        isOpen ? "font-medium" : "font-normal"
                      }`}
                      style={{
                        color: COLOR_LIGHT_GRAY,
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                ) : (
                  <Link
                    to={item.url}
                    className="flex flex-col items-center gap-1 py-4 w-full text-center transition-colors duration-200 text-gray-400 hover:bg-blue-100 hover:text-black"
                    style={{
                      backgroundColor: isActive ? COLOR_VIOLET : "",
                      color: isActive ? "white" : COLOR_LIGHT_GRAY,
                    }}
                  >
                    <Icon size={22} />
                    <span className="text-[14px] font-normal">
                      {item.title}
                    </span>
                  </Link>
                )}

                {/* render children  */}
                {hasChildren && isOpen && (
                  <div className="flex flex-col border-gray-200">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = location.pathname === child.url;
                      return (
                        <Link
                          to={child.url}
                          key={child.title}
                          className="flex flex-col items-center gap-1 py-3 text-[13px] font-normal w-full hover:bg-blue-100 hover:text-black"
                          style={{
                            backgroundColor: isChildActive ? COLOR_VIOLET : "",
                            color: isChildActive ? "white" : COLOR_LIGHT_GRAY,
                          }}
                        >
                          <ChildIcon size={20} />
                          <span>{child.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* sidebar */}
          <motion.div
            key="sidebar"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            className="lg:hidden fixed top-0 left-0 h-full w-full bg-white z-50"
          >
            {/* sidebar header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <IconX
                    size={22}
                    className="text-gray-700 hover:text-gray-800"
                  />
                </button>
                <div className="w-full flex items-center justify-center">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={companyName || "Logo"}
                      className="w-10 h-10 object-cover rounded shadow tracking-wide select-none"
                      style={{ borderColor: COLOR_ATHENS_GRAY }}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      width="40"
                      height="40"
                    />
                  ) : (
                    <h2 className="logo font-extrabold text-[24px] tracking-wide select-none">
                      {companyName &&
                        (companyName.length > 5
                          ? getInitials(companyName)
                          : companyName.toUpperCase())}
                    </h2>
                  )}
                </div>
              </div>
            </div>

            {/* sidebar content */}
            <div className="overflow-auto h-full pb-20 bg-gray-50">
              <nav className="p-6 space-y-3">
                {items.map((item) => {
                  const Icon = item.icon;
                  const hasChildren = item.children && item.children.length > 0;
                  const isOpen = openMenus.includes(item.title);
                  const isActive = location.pathname === item.url;
                  const displayTitle = item.title;

                  return (
                    <div key={item.title}>
                      {hasChildren ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                          <button
                            onClick={() => toggleMenu(item.title)}
                            className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 rounded-xl transition-all duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <Icon size={22} className="text-gray-600" />
                              </div>
                              <span className="text-gray-800 font-semibold text-lg">
                                {displayTitle}
                              </span>
                            </div>
                            <div
                              className={`transform transition-transform duration-200 ${
                                isOpen ? "rotate-90" : "rotate-0"
                              }`}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                className="text-gray-400"
                              >
                                <path fill="currentColor" d="M6 4l4 4-4 4z" />
                              </svg>
                            </div>
                          </button>

                          {/* render children */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="px-4 pb-4 space-y-2">
                              {item.children.map((child) => {
                                const ChildIcon = child.icon;
                                const isChildActive =
                                  location.pathname === child.url;
                                return (
                                  <Link
                                    to={child.url}
                                    key={child.title}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                                      isChildActive
                                        ? "text-white shadow-md transform scale-[1.02]"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                    style={{
                                      backgroundColor: isChildActive
                                        ? COLOR_VIOLET
                                        : "",
                                    }}
                                  >
                                    <ChildIcon size={18} />
                                    <span className="font-medium">
                                      {child.title}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={item.url}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] bg-white shadow-sm border border-gray-100 ${
                            isActive
                              ? "text-white shadow-md transform scale-[1.02]"
                              : "text-gray-800 hover:bg-gray-50"
                          }`}
                          style={{
                            backgroundColor: isActive ? COLOR_VIOLET : "",
                          }}
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              isActive
                                ? "bg-white bg-opacity-20"
                                : "bg-gray-100"
                            }`}
                          >
                            <Icon
                              size={22}
                              className={
                                isActive ? "text-black" : "text-gray-600"
                              }
                            />
                          </div>
                          <span className="font-semibold text-lg">
                            {displayTitle}
                          </span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default SidebarComp;
