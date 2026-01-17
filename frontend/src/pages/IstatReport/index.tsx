"use client";

import { BookingsDataTable } from "@/components/BookingsTable";
import { DatePicker } from "@/components/DatePicker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  COLOR_DEEP_TEAL,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_VIOLET,
  COUNTRY,
  PORTALS,
} from "@/constants/constants";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  Filter,
} from "lucide-react";
import { useState } from "react";

// Sample data for the dashboard
const sampleData = [
  {
    id: 1,
    arrivalDate: "2024-01-15",
    departureDate: "2024-01-18",
    nights: 3,
    nationality: "Italy",
    adults: 2,
    children: 0,
    purpose: "Leisure",
    roomType: "Double",
    property: "Hotel Roma",
    source: "Booking.com",
    hasErrors: false,
  },
  {
    id: 2,
    arrivalDate: "2024-01-16",
    departureDate: "2024-01-20",
    nights: 4,
    nationality: "Spain",
    adults: 1,
    children: 1,
    purpose: "Business",
    roomType: "Single",
    property: "Villa Toscana",
    source: "Direct",
    hasErrors: true,
  },
  {
    id: 3,
    arrivalDate: "2024-01-17",
    departureDate: "2024-01-19",
    nights: 2,
    nationality: "France",
    adults: 2,
    children: 0,
    purpose: "Leisure",
    roomType: "Suite",
    property: "Hotel Roma",
    source: "Airbnb",
    hasErrors: false,
  },
];

const historyData = [
  { month: "August 2025", status: "submitted", submittedBy: "Marco Rossi" },
  { month: "July 2025", status: "submitted", submittedBy: "Anna Bianchi" },
  { month: "June 2025", status: "pending", submittedBy: null },
];

const calendarData = {
  "2024-01": {
    totalRooms: 15,
    totalBeds: 27,
    days: Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      availableRooms: Math.floor(Math.random() * 15) + 1,
      availableBeds: Math.floor(Math.random() * 30) + 1,
      occupiedRooms: Math.floor(Math.random() * 16) + 1,
      arrivals: Math.floor(Math.random() * 25) + 1,
      presences: Math.floor(Math.random() * 60) + 10,
      status: "open",
    })),
  },
};

export default function ISTATMonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    format(new Date(), "yyyy-MM"),
  );
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedNationality, setSelectedNationality] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [data, setData] = useState(sampleData);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(1);
  const [date, setDate] = useState<Date | null>(new Date());

  const totalGuests = data.reduce(
    (sum, row) => sum + row.adults + row.children,
    0,
  );
  const totalNights = data.reduce((sum, row) => sum + row.nights, 0);
  const averageStay = totalNights / data.length;
  const propertiesCount = new Set(data.map((row) => row.property)).size;
  const validRows = data.filter((row) => !row.hasErrors).length;
  const errorRows = data.filter((row) => row.hasErrors).length;
  const warningRows = 1;

  const filteredData = data.filter((row) => {
    return (
      (selectedProperty === "all" || row.property === selectedProperty) &&
      (selectedNationality === "all" ||
        row.nationality === selectedNationality) &&
      (selectedSource === "all" || row.source === selectedSource)
    );
  });

  const updateNationality = (id: number, nationality: string) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, nationality, hasErrors: nationality === "" }
          : row,
      ),
    );
  };

  const getCurrentMonthData = () => {
    return (
      calendarData["2024-01"] || { totalRooms: 15, totalBeds: 27, days: [] }
    );
  };

  const currentMonthData = getCurrentMonthData();
  const selectedDayData = currentMonthData.days[selectedCalendarDay - 1];

  const cardData = [
    { title: "Total Guests", value: totalGuests },
    { title: "Nights Stayed", value: totalNights },
    {
      title: " Average Stay Length",
      value: averageStay.toFixed(1) + " nights",
    },
    { title: " Properties Included", value: propertiesCount },
  ];

  return (
    <div
      className="p-5 min-h-screen"
      style={{ backgroundColor: COLOR_LIGHT_BLUE }}
    >
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex justify-between">
            <div>
              <h1 className="md:text-xl lg:text-2xl font-bold">
                ISTAT Monthly Report
              </h1>
              <p className="text-sm" style={{ color: COLOR_LIGHT_GRAY }}>
                ISTAT Reporting System
              </p>
            </div>
            <p
              className="text-sm hidden md:block"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Last recalculated · 15/10/2024 14:30 · by Mario Rossi
            </p>
          </div>
        </div>
        {/* inputs */}
        <div className="flex-col flex md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col w-full">
            <Label className="mb-2 text-gray-600">Select Month</Label>
            <DatePicker
              value={selectedMonth}
              onChange={setSelectedMonth}
              mode="month"
            />
          </div>

          <div className="flex flex-col w-full">
            <Label htmlFor="period" className="mb-2 text-gray-600">
              Period
            </Label>
            <Input
              className="h-10 border-gray-300 bg-white w-full"
              id="period"
              placeholder="Jul, Aug, Sep"
            />
          </div>

          <div className="flex flex-col w-full">
            <Label htmlFor="dateOfPresentation" className="mb-2 text-gray-600">
              Date Of Presentation
            </Label>
            <Input
              className="h-10 border-gray-300 bg-white"
              id="dateOfPresentation"
              placeholder="2025-10-15"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Button
            variant={"ghost"}
            onClick={() => setShowCalendar(!showCalendar)}
            className={`${
              showCalendar ? "btn text-white" : "btn-secondary"
            } hover:text-white bg-none gap-2 w-full md:w-fit`}
          >
            <Calendar className="h-4 w-4" />
            {showCalendar ? "Hide Calendar" : "Show Calendar"}
          </Button>
          <Button className="btn gap-2 w-full md:w-fit">
            <Download className="h-4 w-4" />
            Download ISTAT File (XML/CSV)
          </Button>
        </div>

        {showCalendar && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Occupancy Calendar -{" "}
                {selectedMonth
                  ? new Date(selectedMonth + "-01").toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      year: "numeric",
                    },
                  )
                  : "—"}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>N.U. ricettive: {currentMonthData.totalRooms}</span>
                <span>Tot. Letti: {currentMonthData.totalBeds}</span>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-2 min-w-[840px]">
                  {/* Days of week */}
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-muted-foreground p-2 min-w-[120px]"
                      >
                        {day}
                      </div>
                    ),
                  )}

                  {/* Day cells */}
                  {currentMonthData.days.map((dayData) => (
                    <div
                      key={dayData.day}
                      className={`relative border rounded-lg p-2 cursor-pointer transition-colors min-w-[120px] ${
                        selectedCalendarDay === dayData.day
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedCalendarDay(dayData.day)}
                    >
                      <div className="text-right text-xs font-medium mb-1">
                        {dayData.day}
                      </div>

                      <div className="bg-green-100 rounded p-1 text-xs space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-green-800">Cam Disp</span>
                          <span className="font-medium text-green-900">
                            {dayData.availableRooms}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-800">Letti Disp</span>
                          <span className="font-medium text-green-900">
                            {dayData.availableBeds}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-800">Cam Occ</span>
                          <span className="font-medium text-green-900">
                            {dayData.occupiedRooms}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-800">Arrivi</span>
                          <span className="font-medium text-green-900">
                            {dayData.arrivals}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-800">Presenze</span>
                          <span className="font-medium text-green-900">
                            {dayData.presences}
                          </span>
                        </div>
                      </div>

                      <div className="absolute top-1 left-1 text-xs text-blue-600 font-medium">
                        Aperto
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Day Details */}
              {selectedDayData && (
                <Card className="bg-muted/50 mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Day {selectedCalendarDay} Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedDayData.availableRooms}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available Rooms
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedDayData.availableBeds}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available Beds
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedDayData.occupiedRooms}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Occupied Rooms
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedDayData.arrivals}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Arrivals
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedDayData.presences}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Presences
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Summary Cards */}
            <div className="overflow-x-auto scr pb-2 scrollbar-hidden">
              <div className="flex mt-2 gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 scrollbar-hidden">
                {cardData.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="border border-gray-300 bg-white p-4 shadow rounded-md min-w-[170px] lg:min-w-[220px] flex-shrink-0"
                    >
                      <div className="flex flex-col items-start space-y-4">
                        <p className="text-sm text-black">{item.title}</p>
                        <p
                          className="font-semibold text-lg"
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

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {/* Property Type */}
                  <div className="w-full">
                    <label className="text-sm font-medium mb-2 block">
                      Property Type
                    </label>
                    <Select
                      value={selectedProperty}
                      onValueChange={setSelectedProperty}
                    >
                      <SelectTrigger className="h-[40px] w-full border border-gray-400 text-black data-[placeholder]:text-gray-400 text-[17px]">
                        <SelectValue placeholder="Property type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem
                          value="all"
                          className="data-[highlighted]:bg-gray-100 cursor-pointer"
                        >
                          All Properties
                        </SelectItem>
                        <SelectItem
                          value="Hotel Roma"
                          className="data-[highlighted]:bg-gray-100 cursor-pointer"
                        >
                          Hotel Roma
                        </SelectItem>
                        <SelectItem
                          value="Villa Toscana"
                          className="data-[highlighted]:bg-gray-100 cursor-pointer"
                        >
                          Villa Toscana
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nationality */}
                  <div className="w-full">
                    <label className="text-sm font-medium mb-2 block">
                      Nationality
                    </label>
                    <Select
                      value={selectedNationality}
                      onValueChange={setSelectedNationality}
                    >
                      <SelectTrigger
                        id="country"
                        className="h-[40px] w-full border border-gray-400 text-black data-[placeholder]:text-gray-400 text-[17px]"
                      >
                        <SelectValue placeholder="Nationality" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem
                          value="all"
                          className="data-[highlighted]:bg-gray-100 cursor-pointer"
                        >
                          All
                        </SelectItem>
                        {COUNTRY.map((country, index) => (
                          <SelectItem
                            key={index}
                            value={country}
                            className="data-[highlighted]:bg-gray-100 cursor-pointer"
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Source */}
                  <div className="w-full">
                    <label className="text-sm font-medium mb-2 block">
                      Source
                    </label>
                    <Select
                      value={selectedSource}
                      onValueChange={setSelectedSource}
                    >
                      <SelectTrigger
                        className="h-[40px] w-full border border-gray-500 rounded-md py-1.5 text-sm
                      data-[placeholder]:text-gray-400"
                      >
                        <SelectValue placeholder="Portal" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem
                          value="all"
                          className="data-[highlighted]:bg-gray-100 cursor-pointer"
                        >
                          All
                        </SelectItem>
                        {PORTALS.map((portal) => (
                          <SelectItem
                            key={portal}
                            value={portal}
                            className="data-[highlighted]:bg-gray-100 cursor-pointer"
                          >
                            {portal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-3 rounded-md border bg-white border-gray-300 p-3">
              <p className="text-sm" style={{ color: COLOR_DEEP_TEAL }}>
                <span className="text-sm font-bold text-red-600">
                  Warning :{" "}
                </span>
                Missing nationality information for 1 guest
              </p>
            </div>

            {/* Main Table */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <BookingsDataTable/>
                </div>
              </CardContent>
            </Card>

            {/* Export Section */}
            <Card>
              <CardHeader>
                <CardTitle>Export</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-col md:flex-row">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 bg-transparent hover:bg-gray-100"
                      >
                        <FileText className="h-4 w-4" />
                        Preview ISTAT XML/CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>ISTAT File Preview</DialogTitle>
                      </DialogHeader>
                      <div className="bg-muted p-4 rounded-md font-mono text-sm max-h-96 overflow-auto">
                        <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<istat_report month="01" year="2024">
  <guest_data>
    <record>
      <arrival_date>2024-01-15</arrival_date>
      <departure_date>2024-01-18</departure_date>
      <nights>3</nights>
      <nationality>IT</nationality>
      <adults>2</adults>
      <children>0</children>
      <purpose>Leisure</purpose>
    </record>
    <!-- Additional records... -->
  </guest_data>
</istat_report>`}</pre>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button className="gap-2 btn">
                    <Download className=" h-4 w-4" />
                    Download File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* History Section */}
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {historyData.map((report, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{report.month}</span>
                        {report.status === "submitted" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {report.status}
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            {report.status}
                          </Badge>
                        )}
                      </div>

                      {report.submittedBy && (
                        <span className="text-sm text-muted-foreground md:text-right">
                          by {report.submittedBy}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validation Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validation Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Valid Rows</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {validRows}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Warnings</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    {warningRows}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Errors</span>
                  </div>
                  <Badge variant="destructive">{errorRows}</Badge>
                </div>
                <Button
                  className="w-full mt-4 bg-transparent hover:bg-gray-100"
                  variant="outline"
                  disabled={errorRows === 0}
                >
                  Fix All Issues
                </Button>
              </CardContent>
            </Card>

            {errorRows > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">
                    Issues Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <span>
                        Missing nationality information for {errorRows} guest
                        {errorRows > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
