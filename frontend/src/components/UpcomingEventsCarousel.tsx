import {
  COLOR_BLUE,
  COLOR_DARK_RED,
  COLOR_GREEN,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_GREEN,
  COLOR_VIOLET,
  COLOR_YELLOW,
} from "@/constants/constants";
import rawData from "@/lib/carouselData.json";
import { Card, CardContent } from "./ui/Card";

export function UpcomingEventsCarousel() {
  return (
    <div className="w-full my-5">
      <div className="w-full overflow-x-auto pb-4 scroll-smooth scr snap-x snap-mandatory">
        <div className="flex gap-6 min-w-max">
          {rawData.map((item, index) => {
            const type = item.type.toLowerCase();
            return (
              <div
                key={index}
                className="snap-start w-48 sm:w-72 md:w-80 lg:w-72 xl:w-80 flex-shrink-0"
              >
                <Card className="w-full h-full shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-2">
                    {/* Status */} 
                    <div
                      className="btn w-24 text-center rounded-full"
                      style={{
                        backgroundColor:
                          item.status === "check in"
                            ? COLOR_LIGHT_GREEN
                            : COLOR_LIGHT_BLUE,
                      }}
                    >
                      <span
                        className="text-[14px] sm:text-[15px] capitalize"
                        style={{
                          color:
                            item.status === "check in"
                              ? COLOR_GREEN
                              : COLOR_BLUE,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Name */}
                    <p
                      className="text-[14px] sm:text-[16px] truncate"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      {item.name}
                    </p>

                    {/* Nights + Type */}
                    <p className="text-[15px] sm:text-[17px] font-medium">
                      {item.nights}/{" "}
                      <span
                        className="text-gray-600 text-[15px] sm:text-[17px] font-medium capitalize"
                        style={{
                          color:
                            type === "booking"
                              ? COLOR_BLUE
                              : type === "airbnb"
                                ? COLOR_DARK_RED
                                : type === "direct"
                                  ? COLOR_LIGHT_GRAY
                                  : type === "expedia"
                                    ? COLOR_YELLOW
                                    : COLOR_LIGHT_GRAY,
                        }}
                      >
                        {item.type}
                      </span>
                    </p>

                    {/* Price */}
                    <p
                      className="font-bold text-[22px] sm:text-[28px]"
                      style={{ color: COLOR_VIOLET }}
                    >
                      {item.price}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
