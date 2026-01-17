import {
  COLOR_BLUE,
  COLOR_DARK_RED,
  COLOR_GREEN,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GREEN,
  COLOR_LIGHT_SILVER,
  COLOR_VIOLET,
} from "@/constants/constants";
import { BookingPayload, useGetBookings } from "@/services/bookings";
import {
  PropertyRatesResponse,
  useGetPropertiesRates,
  useUpdateRate,
} from "@/services/ratesCalendar";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import { slideVariants } from "@/utils/animation";
import { getVisibleReservationPosition } from "@/utils/getReservationBarsPosition";
import { getBackgroundColor, getBackgroundColorLight } from "@/utils/helper";
import { format } from "date-fns";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import PriceConfirmationModal, {
  InputData,
} from "./Modals/RoomsPriceCornfirmationModal";
import { TbBrandAirbnb, TbBrandBooking } from "react-icons/tb";
import { SiExpedia } from "react-icons/si";

interface RoomPricingGridProps {
  allDates: Date[];
  visibleDates: Date[];
  cellWidth: number;
  selectedMonth: string;
  dateOffset: number;
  direction: "left" | "right";
  selectedPropertyTypeId: number;
  selectedStructureId: number;
  searchTerm: string;
}

export const RoomPricingGrid: React.FC<RoomPricingGridProps> = ({
  allDates,
  visibleDates,
  cellWidth,
  selectedMonth,
  dateOffset,
  direction,
  selectedPropertyTypeId,
  searchTerm,
  selectedStructureId,
}) => {
  const [showPortals, setShowPortals] = useState<{ [key: number]: boolean }>(
    {},
  );

  const initialInputData: InputData = {
    propertyName: "",
    propertyId: 0,
    date: "",
    basePrice: "",
    minNight: "",
  };

  const [showSlideModal, setShowSlideModal] = useState(false);
  const [inputData, setInputData] = useState(initialInputData);

  //for mobile interview
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Fetch API data
  const [yearStr, monthStr] = selectedMonth.split("-");
  const { data: roomsRateData } = useGetPropertiesRates(
    Number(monthStr),
    Number(yearStr),
  );

  //get all rooms
  const { data: allRooms } = useGetAllRooms();

  const updateRateMutation = useUpdateRate();

  // merge all rooms with rates
  const mergedData: PropertyRatesResponse[] =
    allRooms?.map((room: PropertyPayload) => {
      const roomRates = roomsRateData?.find((p) => p.property_id === room.id);
      return {
        property_id: room.id,
        property_name: room.name,
        property_type: room.property_type,
        structure: room.structure,
        rates: roomRates?.rates || [],
      };
    }) || [];

  // Filter data
  const filtered = mergedData?.filter((item) => {
    const matchesPropertyType =
      selectedPropertyTypeId === 0 ||
      item.property_type === selectedPropertyTypeId;

    const matchesStructureType =
      selectedStructureId === 0 || item.structure === selectedStructureId;

    const matchesSearch =
      !searchTerm ||
      item.property_name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPropertyType && matchesStructureType && matchesSearch;
  });

  const data =
    selectedPropertyTypeId || selectedStructureId || searchTerm
      ? filtered
      : mergedData;

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  //handle input change
  const handleInputChange = (
    propertyName: string,
    propertyId: number,
    date: string,
    field: "minNights" | "basePrice",
    value: number,
  ) => {
    const updatedData = {
      ...inputData,
      propertyName,
      propertyId,
      date,
      basePrice: field === "basePrice" ? value : inputData.basePrice,
      minNight: field === "minNights" ? value : inputData.minNight,
    };

    setInputData(updatedData);

    if (updatedData.basePrice && updatedData.minNight && !showSlideModal) {
      setShowSlideModal(true);
    }
  };

  //reset data
  const handleDiscardChanges = () => {
    setShowSlideModal(false);
    setInputData(initialInputData);
  };

  //for confirmation
  const handleSynchronizeNow = () => {
    if (!inputData.propertyId || !inputData.date) return;

    updateRateMutation.mutate({
      property: inputData.propertyId,
      date: inputData.date,
      base_price: Number(inputData.basePrice),
      min_nights: Number(inputData.minNight),
    });

    setShowSlideModal(false);
    setInputData(initialInputData);
  };

  const datesToRender = visibleDates;

  // find current day column index
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayIndex = datesToRender.findIndex(
    (d) => format(d, "yyyy-MM-dd") === todayStr,
  );

  // check for first day of month
  const isFirstOfMonth = (date: Date) => date.getDate() === 1;

  // responsive cell width
  const responsiveCellWidth = isMobile ? 70 : cellWidth;

  //show the highlighted borders for booked rooms
  const getBookings = useGetBookings();
  const bookingsData = getBookings?.data;

  if (!data || data.length === 0)
    return (
      <>
        <h2 className="text-center text-gray-800 mt-10 font-semibold text-[17px]">
          Property is not added yet!
        </h2>
      </>
    );

  return (
    <>
      <div className="booking-grid overflow-x-auto">
        <div
          className="relative"
          style={{
            minWidth: `80px`,
          }}
        >
          <div className="grid relative z-10">
            {data?.map((property, index) => {
              const isLast = index === data.length - 1;
              const propertyBookings = bookingsData?.filter(
                (b: BookingPayload) => b.property === property.property_id,
              );

              return (
                <div
                  key={property.property_id}
                  className={` w-full ${isLast ? "border-b" : ""}`}
                  style={{ borderColor: COLOR_BLUE }}
                >
                  <div
                    className="flex items-center border-t lg:min-h-[98px] relative"
                    style={{ borderColor: COLOR_BLUE }}
                  >
                    {/* Property Label */}
                    <div
                      className="property-label w-[68px] md:w-[148px] ps-2 font-medium text-black text-[11px] md:text-[13px] capitalize cursor-pointer flex-shrink-0"
                      onClick={() =>
                        setShowPortals((prev) => ({
                          ...prev,
                          [property.property_id]: !prev[property.property_id],
                        }))
                      }
                    >
                      <div className="truncate text-wrap">
                        {property.property_name}
                      </div>
                      <span
                        className="text-[10px] md:text-[12px] items-center font-medium w-fit rounded-md sm:rounded-full px-1 md:px-2 py-0.5 flex mt-2 whitespace-nowrap"
                        style={{
                          backgroundColor: COLOR_LIGHT_GREEN,
                          color: COLOR_GREEN,
                        }}
                      >
                        Base <span className="hidden sm:block">-Price</span>{" "}
                        <ChevronDown size={12} className="inline ml-1" />
                      </span>
                    </div>

                    {/* Input boxes grid */}
                    <div className="flex flex-1 overflow-hidden">
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                          key="pricing-grid-main"
                          // key={dateOffset}
                          custom={direction}
                          variants={
                            slideVariants(responsiveCellWidth) as Variants
                          }
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            duration: 0.3,
                            ease: [0.25, 0.8, 0.25, 1],
                          }}
                          className="nights-wrapper flex flex-1 relative"
                          style={{
                            minWidth:
                              datesToRender.length * responsiveCellWidth,
                          }}
                        >
                          {/* highlighted booking borders */}
                          <div className="absolute inset-0 pointer-events-none">
                            {propertyBookings?.map(
                              (booking: BookingPayload, idx: number) => {
                                const startIndex = allDates.findIndex(
                                  (d) =>
                                    format(d, "yyyy-MM-dd") ===
                                    format(
                                      new Date(booking.check_in_date),
                                      "yyyy-MM-dd",
                                    ),
                                );

                                const endIndex = allDates.findIndex(
                                  (d) =>
                                    format(d, "yyyy-MM-dd") ===
                                    format(
                                      new Date(booking.check_out_date),
                                      "yyyy-MM-dd",
                                    ),
                                );

                                if (startIndex === -1 || endIndex === -1)
                                  return null;

                                const position = getVisibleReservationPosition({
                                  startIndex,
                                  endIndex,
                                  dateOffset,
                                  visibleCount: visibleDates.length,
                                  cellWidth: responsiveCellWidth,
                                });

                                if (!position) return null;

                                return (
                                  <div
                                    key={`booking-${booking.id}`}
                                    className="absolute rounded-full"
                                    style={{
                                      left: `${position.left}px`,
                                      width: `${position.width}px`,
                                      top: 0,
                                      height: 3,
                                      backgroundColor: getBackgroundColor(
                                        booking.platform,
                                      ),
                                      zIndex: 50,
                                    }}
                                  />
                                );
                              },
                            )}
                          </div>

                          {datesToRender.map((date, idx) => {
                            const dateStr = formatDate(date);
                            const rate = property.rates.find(
                              (r) => r.date === dateStr,
                            );
                            const showIcon = isFirstOfMonth(date);
                            const isToday = dateStr === todayStr;

                            return (
                              <div key={date.toISOString()}>
                                <div
                                  key={`${property.property_id}-${dateStr}`}
                                  className={`${
                                    isToday ? "border-t" : "border-l"
                                  } ${isToday ? "bg-red-100" : ""}  flex items-center nights-wrapper justify-center text-sm relative px-1 py-2 md:py-3 flex-col property-label-wrapper`}
                                  style={{
                                    width: responsiveCellWidth,
                                    minWidth: responsiveCellWidth,
                                    borderColor: COLOR_LIGHT_BLUE,
                                  }}
                                >
                                  <div
                                    className={` nights-container flex flex-col items-center rounded justify-between ${
                                      showIcon
                                        ? "w-[60px] md:w-[80px]"
                                        : "w-fit"
                                    }`}
                                  >
                                    <div
                                      className={`nights-input flex items-center ${
                                        showIcon
                                          ? "justify-between"
                                          : "justify-end"
                                      } w-[60px] md:w-[80px]`}
                                    >
                                      {showIcon && (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={isMobile ? 18 : 24}
                                          height={isMobile ? 18 : 24}
                                          viewBox="0 0 56 56"
                                          style={{ color: COLOR_VIOLET }}
                                        >
                                          <path
                                            fill="currentColor"
                                            d="M38.524 11.125H33.18v-.117l5.46-7.195c.493-.634.68-1.032.68-1.454c0-.726-.562-1.171-1.336-1.171h-7.523c-.703 0-1.242.469-1.242 1.195c0 .773.539 1.219 1.242 1.219H35.5v.117l-5.531 7.172c-.492.656-.68.984-.68 1.476c0 .68.54 1.195 1.313 1.195h7.921c.704 0 1.22-.468 1.22-1.242c0-.703-.516-1.195-1.22-1.195m10.968 8.977H45.72v-.094l3.89-5.086c.445-.61.633-.961.633-1.383c0-.68-.539-1.125-1.265-1.125h-5.743c-.656 0-1.148.469-1.148 1.149c0 .726.492 1.171 1.148 1.171h3.399v.094l-3.867 5.063c-.446.562-.61.937-.61 1.406c0 .633.492 1.125 1.22 1.125h6.116c.68 0 1.149-.445 1.149-1.172c0-.68-.469-1.148-1.149-1.148m-23.648 34.71c8.578 0 15.515-4.312 18.68-11.648c.421-1.008.28-1.781-.165-2.25c-.422-.398-1.125-.492-1.968-.164c-1.758.703-3.914 1.102-6.61 1.102c-10.476 0-17.226-6.54-17.226-16.829c0-2.835.539-5.648 1.265-7.125c.47-.937.422-1.734.024-2.226c-.446-.516-1.242-.68-2.344-.235c-7.195 2.93-12.14 10.43-12.14 19.196c0 11.414 8.39 20.18 20.484 20.18m.047-3.562c-10.008 0-16.97-7.29-16.97-16.898c0-5.907 2.743-11.11 7.102-14.438c-.562 1.523-.89 3.867-.89 6.117c0 11.532 7.969 19.266 19.758 19.266c2.109 0 4.03-.258 5.015-.61c-2.93 4.055-8.156 6.563-14.015 6.563m13.265-23.133h-3.21v-.094l3.304-4.382c.422-.61.61-.914.61-1.313c0-.68-.516-1.078-1.196-1.078h-5.062c-.633 0-1.102.445-1.102 1.102c0 .68.469 1.101 1.102 1.101h2.812v.094l-3.258 4.36c-.422.562-.586.89-.586 1.335c0 .61.47 1.055 1.149 1.055h5.437c.633 0 1.078-.422 1.078-1.102c0-.656-.445-1.078-1.078-1.078"
                                          />
                                        </svg>
                                      )}
                                      <input
                                        type="number"
                                        placeholder="N"
                                        value={
                                          inputData.propertyId ===
                                            property.property_id &&
                                          inputData.date === dateStr &&
                                          inputData.minNight !== undefined
                                            ? inputData.minNight
                                            : (rate?.minNights ?? "")
                                        }
                                        className="no-spinner h-[28px] md:h-[36px] w-[24px] md:w-[30px] mb-1 text-[12px] md:text-[14px] font-medium text-center border rounded-md bg-white text-black outline-none"
                                        style={{
                                          borderColor: COLOR_LIGHT_SILVER,
                                        }}
                                        onChange={(e) =>
                                          handleInputChange(
                                            property.property_name,
                                            property.property_id,
                                            dateStr,
                                            "minNights",
                                            Number(e.target.value),
                                          )
                                        }
                                      />
                                    </div>

                                    <input
                                      type="number"
                                      placeholder="€"
                                      value={
                                        inputData.propertyId ===
                                          property.property_id &&
                                        inputData.date === dateStr &&
                                        inputData.basePrice !== undefined
                                          ? inputData.basePrice
                                          : (rate?.basePrice ?? "")
                                      }
                                      className="no-spinner h-[28px] md:h-[36px] w-[60px] md:w-[80px] text-[12px] md:text-[14px] text-center border font-medium rounded-md bg-white text-black outline-none"
                                      style={{
                                        borderColor: COLOR_LIGHT_SILVER,
                                      }}
                                      onChange={(e) =>
                                        handleInputChange(
                                          property.property_name,
                                          property.property_id,
                                          dateStr,
                                          "basePrice",
                                          Number(e.target.value),
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="pe-2 md:pe-0 ">
                      <button className="disabled:opacity-50 invisible hover:bg-gray-100 rounded-md">
                        <ChevronRight />
                      </button>
                    </div>
                  </div>

                  {/* Portal Rows */}
                  {showPortals[property.property_id] &&
                    (["expedia", "booking_com", "airbnb"] as const).map(
                      (portal) => {
                        return (
                          <div
                            key={`${property.property_id}-${portal}`}
                            className="flex items-center min-h-[40px] md:min-h-[48px]"
                          >
                            {/* Portal label */}
                            <div className="property-label w-[68px] md:w-[148px] text-[11px] md:text-[13px] cursor-pointer flex-shrink-0 ps-2 text-sm font-medium capitalize text-white">
                              <div className="flex justify-center items-center">
                                <div
                                  className="flex md:hidden items-center justify-center w-fit"
                                  style={{
                                    backgroundColor: getBackgroundColor(
                                      portal.toLowerCase(),
                                    ),
                                    color: getBackgroundColorLight(
                                      portal.toLowerCase(),
                                    ),
                                  }}
                                >
                                  {portal === "airbnb" ? (
                                    <TbBrandAirbnb size={18} />
                                  ) : portal === "booking_com" ? (
                                    <TbBrandBooking size={18} />
                                  ) : (
                                    <SiExpedia size={16} />
                                  )}
                                </div>
                              </div>
                              <button
                                className={`hidden md:block min-w-[52px] capitalize rounded-full px-2 md:px-3 text-[10px] md:text-[12px]`}
                                style={{
                                  backgroundColor: getBackgroundColor(portal),
                                  height: "20px",
                                }}
                              >
                                {portal}
                              </button>
                            </div>

                            {/* Portal price cells */}
                            <div className="flex flex-1 overflow-hidden">
                              <AnimatePresence
                                initial={false}
                                custom={direction}
                              >
                                <motion.div
                                  key={`portal-${portal}`}
                                  custom={direction}
                                  variants={
                                    slideVariants(
                                      responsiveCellWidth,
                                    ) as Variants
                                  }
                                  initial="enter"
                                  animate="center"
                                  exit="exit"
                                  transition={{
                                    duration: 0.3,
                                    ease: [0.25, 0.8, 0.25, 1],
                                  }}
                                  className="flex flex-1 sm:min-w-auto"
                                  style={{
                                    minWidth:
                                      datesToRender.length *
                                      responsiveCellWidth,
                                  }}
                                >
                                  {datesToRender.map((date, idx) => {
                                    const dateStr = formatDate(date);
                                    const rate = property.rates.find(
                                      (r) => r.date === dateStr,
                                    );
                                    const isToday = dateStr === todayStr;

                                    return (
                                      <div
                                        key={`${property.property_id}-${portal}-${dateStr}`}
                                        className={` ${isToday ? " bg-red-100" : ""} nights-container  property-label-wrapper px-1 py-1 md:py-2 flex justify-center`}
                                        style={{
                                          width: responsiveCellWidth,
                                          borderLeft: `1px solid ${COLOR_LIGHT_BLUE}`,
                                        }}
                                      >
                                        <input
                                          type="number"
                                          placeholder="€"
                                          value={rate?.[portal] ?? ""}
                                          className="no-spinner h-[28px] md:h-[36px] font-medium w-[60px] md:w-[80px] text-[12px] md:text-[14px] text-center border rounded bg-white outline-none text-gray-700"
                                          style={{
                                            borderColor: COLOR_LIGHT_SILVER,
                                          }}
                                        />
                                      </div>
                                    );
                                  })}
                                </motion.div>
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                      },
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Modal */}
      <PriceConfirmationModal
        isOpen={showSlideModal}
        inputData={inputData}
        onClose={() => setShowSlideModal(false)}
        onDiscard={handleDiscardChanges}
        onSynchronize={handleSynchronizeNow}
      />
    </>
  );
};
