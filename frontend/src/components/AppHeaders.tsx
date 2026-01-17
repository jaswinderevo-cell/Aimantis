import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropDownMenu";
import { ROUTES } from "@/constants/routes";
import { BookingPayload } from "@/services/bookings";
import { useGetMyProfile } from "@/services/myAccount";
import { LogOut } from "lucide-react";
import { FaBell } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { TbArrowNarrowLeft, TbMenu2 } from "react-icons/tb";
import { Link } from "react-router-dom";

interface HeaderProps {
  breadCrumbs: string;
  singleBooking?: BookingPayload;
  handleNavigate?: () => void;
  toggleMobileMenu: () => void;
  logout: { mutate: () => void };
}

export default function Header({
  breadCrumbs,
  singleBooking,
  handleNavigate,
  toggleMobileMenu,
  logout,
}: HeaderProps) {
  
  const is_main_guest = singleBooking?.guests?.find((g) => g.is_main_guest);
  const full_name = is_main_guest?.full_name ?? "";

  const { data : myProfile } = useGetMyProfile();
  const userName = myProfile?.data?.username;

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden h-[79px] lg:flex shrink-0 justify-between items-center gap-2 border-b-2 border-blue-50 px-4">
        <h2 className="text-[20px] font-semibold capitalize">
          {breadCrumbs}
          {full_name ? (
            <>
              <TbArrowNarrowLeft
                onClick={handleNavigate}
                size={25}
                className="cursor-pointer inline-block mr-2"
              />
              {full_name}
            </>
          ) : null}
        </h2>
        <div className="flex items-center justify-between gap-5">
          <FaBell className="w-5 h-5 hover:cursor-pointer" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 hover:cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src="/profile.jpg"
                    alt="profile picture"
                    className="object-cover w-full h-full rounded-full"
                    loading="lazy"                    
                  />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white text-black shadow-lg rounded-md p-2"
              align="end"
            >
              <DropdownMenuLabel className="px-3 py-2 text-sm font-normal">
                <div className="flex items-center">
                  <Avatar className="mr-2 h-10 w-10">
                    <AvatarImage
                      src="/profile.jpg"
                      alt="profile"
                      className="object-cover w-full h-full rounded-full"
                    />
                    <AvatarFallback>Avatar</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">{userName ?? "Admin"}</span>
                    <span className="text-gray-500 text-xs">Super Admin</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to={ROUTES.PROFILE}>
                  <DropdownMenuItem className="hover:bg-gray-100 px-3 py-2 text-[13px] rounded-md hover:cursor-pointer">
                    <MdManageAccounts className="mr-2 h-4 w-4" />
                    <span className="font-medium">My Account</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout.mutate()}
                className="px-3 py-2 text-[13px] rounded-md hover:bg-gray-100 text-red-600 hover:cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <TbMenu2 size={24} className="text-gray-700" />
          </button>
          <div className="font-extrabold text-xl tracking-wide">BLISS</div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <FaBell className="w-5 h-5 hover:cursor-pointer" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 hover:cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src="/profile.jpg"
                    alt="profile picture"
                    className="object-cover w-full h-full rounded-full"
                  />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white text-black shadow-lg rounded-md p-2"
              align="end"
            >
              <DropdownMenuLabel className="px-3 py-2 text-sm font-normal">
                <div className="flex items-center">
                  <Avatar className="mr-2 h-10 w-10">
                    <AvatarImage
                      src="/profile.jpg"
                      alt="profile"
                      className="object-cover w-full h-full rounded-full"
                    />
                    <AvatarFallback>Avatar</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{userName ?? "Admin"}</span>
                    <span className="text-gray-500 text-xs">Super Admin</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to={ROUTES.PROFILE}>
                  <DropdownMenuItem className="hover:bg-gray-100 px-3 py-2 text-[13px] rounded-md hover:cursor-pointer">
                    <MdManageAccounts className="mr-2 h-4 w-4" />
                    <span className="font-medium">My Account</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout.mutate()}
                className="px-3 py-2 text-[13px] rounded-md hover:bg-gray-100 text-red-600 hover:cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
