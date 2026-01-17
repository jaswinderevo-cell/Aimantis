import { ChartBarLabelCustom } from "@/components/BarChart";
import { CreateBooking } from "@/components/Modals/CreateNewBooking";
import { RadialChart } from "@/components/RadialChart";
import { Button } from "@/components/ui/Button";
import { UpcomingEventsCarousel } from "@/components/UpcomingEventsCarousel";
import { VerticalBarGraph } from "@/components/VerticalBarChart";
import {
  COLOR_BLUE,
  COLOR_GRADIENT_DARK,
  COLOR_GRADIENT_LIGHT,
  COLOR_LIGHT_GRAY,
  COLOR_VIOLET,
} from "@/constants/constants";
import SharedBreadCrumb from "@/utils/sharedBreadCrumb";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { BsBoxArrowLeft, BsBoxArrowRight } from "react-icons/bs";
import { FiCalendar } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import {
  TbBed,
  TbBuildingCommunity,
  TbCalendarPlus,
  TbReportSearch,
} from "react-icons/tb";

const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

const overViewArr = [
  { label: "Today's", title: "Check-in", value: 5, icon: BsBoxArrowLeft },
  { label: "Today's", title: "Check-out", value: 3, icon: BsBoxArrowRight },
  {
    label: "Total guests",
    title: "In structure",
    value: 16,
    icon: LuUsers,
  },
  { label: "Total beds", title: "Available", value: 10, icon: TbBed },
  {
    label: "Total",
    title: "Occupied rooms",
    value: 9,
    icon: TbBuildingCommunity,
  },
];

const RoomStatusToday = [
  { label: "Occupied Rooms", value: 5 },
  { label: "Available Rooms", value: 2 },
  { label: "Clean", value: 2 },
  { label: "Inspected", value: 2 },
];

const customersFeedback = [
  {
    name: "Mark",
    review: "Food could be better",
    propName: "21-Ardesia",
  },
  {
    name: "Christian",
    review: "Facilities are not enough for amount paid",
    propName: "22-Sabbia",
  },
  {
    name: "Alexander",
    review: "Room cleaning could be better",
    propName: "23-Caruggio",
  },
];

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="lg:py-2 lg:px-5"
        style={{
          background: `linear-gradient(to bottom, ${COLOR_GRADIENT_LIGHT}, ${COLOR_GRADIENT_DARK})`,
        }}
      >
        {/* Section 1 */}
        <section className="border-b border-gray-200">
          <SharedBreadCrumb />
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 p-4">
            <p className="text-black text-lg lg:text-xl font-semibold">
              {currentDate}
            </p>
            <div className="w-full md:w-auto">
              <Button
                className="btn w-full md:w-auto flex items-center justify-center gap-2 font-medium text-[14px] hover:cursor-pointer"
                style={{
                  padding: "12px 24px",
                  fontSize: "15px",
                }}
                onClick={() => setIsModalOpen(true)}
              >
                <TbCalendarPlus style={{ height: "19px", width: "18px" }} />
                Create Booking
              </Button>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mx-auto mt-5 px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <TbReportSearch size={24} />
            <h2 className="font-medium text-[16px]">Overview</h2>
          </div>
          <div className="overflow-x-auto scr pb-2 scrollbar-hidden">
            <div className="flex gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 scrollbar-hidden">
              {overViewArr.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-4 shadow rounded-md min-w-[170px] lg:min-w-[220px] flex-shrink-0"
                  >
                    <Icon
                      size={30}
                      className="mb-4"
                      style={{ color: COLOR_BLUE }}
                    />
                    <p
                      className="font-medium text-[13px]"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      {item.label}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-[17px] text-black font-medium">
                        {item.title}
                      </p>
                      <p
                        className="font-semibold text-[28px] mx-2"
                        style={{ color: COLOR_VIOLET }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* section3 */}
        <section className="mx-auto mt-5 lg:mt-5 px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <FiCalendar size={24} />
            <h2 className="font-medium text-[16px]">Upcoming Events</h2>
          </div>
          <UpcomingEventsCarousel />
        </section>

        {/* section4 */}
        <section className="mx-auto mt-5 lg:my-10 px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {/* Room status today */}
            <div className="h-[220px] rounded-md bg-white p-4 flex flex-col">
              <h2 className="mb-4 font-semibold">Room Status Today</h2>
              <div className="overflow-y-auto flex-1">
                {RoomStatusToday.map((item, index) => (
                  <div key={index} className="flex justify-between my-2">
                    <span className="text-black font-medium text-[16px]">
                      {item.label}
                    </span>
                    <span
                      className="text-[16px] font-medium"
                      style={{ color: COLOR_VIOLET }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Occupancy today */}
            <div className="h-[220px] rounded-md bg-white p-4 flex flex-col">
              <h2 className="text-center font-semibold mb-4">
                Occupancy Today
              </h2>
              <div className="flex-1 flex items-center justify-center">
                <RadialChart />
              </div>
            </div>

            {/* Occupancy 7 days */}
            <div className="h-[220px] rounded-md bg-white p-4 flex flex-col">
              <h2 className="text-center font-semibold mb-4">
                Occupancy 7 Days
              </h2>
              <div className="flex-1 flex items-center justify-center">
                <RadialChart />
              </div>
            </div>

            {/* Avg prices */}
            <div className="h-[220px] rounded-md bg-white p-4 flex flex-col">
              <h2 className="text-center font-semibold mb-2">Avg Prices</h2>
              <div className="flex-1 w-full scr overflow-y-auto scrollbar-hidden">
                <ChartBarLabelCustom />
              </div>
            </div>
          </div>
        </section>

        {/* section5 */}
        <section className="mx-auto px-5 mt-8 pb-5">
          <div className="flex gap-6 overflow-x-auto scr pb-2">
            {/* Card 1: Occupancy Statistics */}
            <div className="min-w-[320px] lg:min-w-0 w-full lg:w-2/3 bg-white h-[258px] rounded-md p-4 flex-shrink-0">
              <div className="flex justify-between">
                <div className="flex items-center gap-1 mb-4">
                  <TbReportSearch size={20} />
                  <h2 className="font-medium">Occupancy Statistics</h2>
                </div>
                <div className="flex font-medium hover:cursor-pointer h-8 lg:me-6 xl:me-6 text-black items-center justify-center text-[15px]">
                  Monthly
                  <ChevronDown size={18} />
                </div>
              </div>
              <VerticalBarGraph />
            </div>

            {/* Card 2: Customers Feedback */}
            <div className="min-w-[320px] lg:min-w-0 w-full lg:w-2/4 p-4 bg-white rounded-md h-[258px] flex-shrink-0">
              <div className="flex items-center gap-1 mb-1">
                <TbReportSearch size={20} />
                <h2 className="font-medium">Customers Feedback</h2>
              </div>
              {customersFeedback.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 gap-4"
                >
                  <div>
                    <p className="text-black font-medium mt-4 text-[14px]">
                      {item.name}
                    </p>
                    <p
                      className="font-normal text-[14px]"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      {item.review}
                    </p>
                  </div>
                  <div className="whitespace-nowrap">
                    <p className="text-black font-medium text-[14px]">
                      {item.propName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <CreateBooking open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default HomePage;
