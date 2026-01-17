import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Textarea } from "@/components/ui/Textarea";
import {
  COLOR_DEEP_TEAL,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_TUNA,
  COLOR_VIOLET,
} from "@/constants/constants";
import type React from "react";

const cardsData = [
  {
    heading: "Guests Subject to Tax",
    price: "0",
    label: "Total guests processed",
  },
  {
    heading: "Taxable Nights",
    price: "0",
    label: "Within 5-night cap",
  },
  {
    heading: "Exempt/Reduced Nights",
    price: "0",
    label: "Beyond 5 cap or exempt",
  },
  {
    heading: "Total to Pay",
    price: "€0.00",
    label: "Amount due to municipality",
  },
];

const AtableData = [
  { periodo: "Luglio", NrOspiti: "0", pernottamenti: "0", imposta: "0.00" },
  { periodo: "Agosto", NrOspiti: "0", pernottamenti: "0", imposta: "0.00" },
  { periodo: "Settembre", NrOspiti: "0", pernottamenti: "0", imposta: "0.00" },
  {
    periodo: "TOTALI",
    NrOspiti: "0",
    pernottamenti: "0",
    imposta: "0.00",
    isTotal: true,
  },
];

const BtableData = [
  { periodo: "Luglio", NrOspiti: "0", pernottamenti: "0" },
  { periodo: "Agosto", NrOspiti: "0", pernottamenti: "0" },
  { periodo: "Settembre", NrOspiti: "0", pernottamenti: "0" },
  {
    periodo: "TOTALI",
    NrOspiti: "0",
    pernottamenti: "0",
    isTotal: true,
  },
];

const CtableData = [
  {
    riduzioni: "Residenti",
    percentuale: 100,
    mese1: { ospiti: 0, pernottamenti: 0 },
    mese2: { ospiti: 0, pernottamenti: 0 },
    mese3: { ospiti: 0, pernottamenti: 0 },
  },
  {
    riduzioni: "I minori fino al quattordicesimo anno di età",
    percentuale: 100,
    mese1: { ospiti: 0, pernottamenti: 0 },
    mese2: { ospiti: 0, pernottamenti: 0 },
    mese3: { ospiti: 0, pernottamenti: 0 },
  },
  {
    riduzioni: "Esenzione piattaforme convenzionate (Airbnb)",
    percentuale: 100,
    mese1: { ospiti: 0, pernottamenti: 0 },
    mese2: { ospiti: 0, pernottamenti: 0 },
    mese3: { ospiti: 0, pernottamenti: 0 },
  },
  {
    riduzioni: "TOTALI",
    percentuale: 3,
    mese1: { ospiti: 0, pernottamenti: 0 },
    mese2: { ospiti: 0, pernottamenti: 0 },
    mese3: { ospiti: 0, pernottamenti: 0 },
    isTotal: true,
  },
];

const DtableData = [
  {
    periodo: "Riepilogo Trimestrale",
    numeroOspiti: 0,
    numeroPernottamenti: 0,
    imposta: "0.00",
  },
];

const CityTaxDocument: React.FC = () => {
  return (
    <div className="p-5" style={{ backgroundColor: COLOR_LIGHT_BLUE }}>
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <div className="flex justify-between">
          <div>
            <h1 className="md:text-xl lg:text-2xl font-bold">
              City Tax (Imposta di Soggiorno)
            </h1>
            <p className="text-sm" style={{ color: COLOR_LIGHT_GRAY }}>
              Genoa Tourist Tax Reporting System
            </p>
          </div>
          <p
            className="text-sm hidden md:block"
            style={{ color: COLOR_LIGHT_GRAY }}
          >
            Last recalculated · 15/10/2024 14:30 · by Mario Rossi
          </p>
        </div>

        {/* inputs and buttons */}
        <div className="w-full space-y-6 mt-5">
          <div className="flex flex-col">
            {/* top inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="structure" className="text-sm text-gray-600">
                  Structure
                </Label>
                <Input
                  id="structure"
                  type="text"
                  defaultValue="BICOCCA/BASE URBAN CHIC RETREAT (CITRA 4455)"
                  className="h-9 text-sm w-full bg-white border-gray-300"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="period" className="text-sm text-gray-600">
                  Period
                </Label>
                <Input
                  id="period"
                  type="text"
                  defaultValue="Q3 – Jul, Aug, Sep"
                  className="h-9 text-sm w-full bg-white border-gray-300 "
                />
              </div>

              <div className="flex flex-col space-y-1 w-full">
                <Label htmlFor="date" className="text-sm text-gray-600">
                  Date of Presentation
                </Label>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <DatePicker
                    value={undefined}
                    onChange={() => undefined}
                    height="h-[36px]"
                    width="100%"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 px-3 text-sm w-full sm:w-auto shrink-0 hover:bg-gray-100"
                  >
                    Recalculate
                  </Button>
                </div>
              </div>
            </div>
            {/* bottom inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="luglio" className="text-sm text-gray-600">
                  Luglio Rate (€)
                </Label>
                <Input
                  id="luglio"
                  type="number"
                  defaultValue="3.00"
                  className="h-9 text-sm w-full bg-white border-gray-300"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="agosto" className="text-sm text-gray-600">
                  Agosto Rate (€)
                </Label>
                <Input
                  id="agosto"
                  type="number"
                  defaultValue="3.00"
                  className="h-9 text-sm w-full bg-white border-gray-300"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="settembre" className="text-sm text-gray-600">
                  Settembre Rate (€)
                </Label>
                <Input
                  id="settembre"
                  type="number"
                  defaultValue="3.00"
                  className="h-9 text-sm w-full bg-white border-gray-300"
                />
              </div>
            </div>

            {/* buttons */}
            <div className="flex flex-col md:flex-row gap-3">
              <Button variant="outline" className="hover:bg-gray-100">
                Export CSV
              </Button>
              <Button variant="outline" className="hover:bg-gray-100">
                Print
              </Button>
              <Button className="btn text-white">Mark as Final</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Calculation Section 1 */}
      <div className="mb-6">
        <div
          className="mb-3 rounded-md border bg-white border-gray-300 p-3"
        >
          <p className="text-sm" style={{ color: COLOR_DEEP_TEAL }}>
            <span className="text-sm font-bold text-red-600">Note: </span>
            Some bookings missing guest birthdays — affects minor exemption
            calculation.
          </p>
        </div>

        {/* Tax Info Cards */}
        <div className="overflow-x-auto scr pb-2 scrollbar-hidden">
          <div className="flex mt-2 gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 scrollbar-hidden">
            {cardsData.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="border border-gray-300 bg-white p-4 shadow rounded-md min-w-[170px] lg:min-w-[220px] flex-shrink-0"
                >
                  <p className="text-[17px] text-black font-medium">
                    {item.heading}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p
                      className="font-semibold text-[28px] mx-2"
                      style={{ color: COLOR_VIOLET }}
                    >
                      {item.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Calculation Table 1 */}
      <div className="mb-6">
        <h3
          className="text-sm lg:text-lg font-bold mb-3"
          style={{ color: COLOR_TUNA }}
        >
          A) SOGGETTI AD IMPOSTA PER PERNOTTAMENTI (Entro il limite di imposta
          di 8 pernottamenti)
        </h3>
        <div className="bg-white overflow-hidden border border-gray-300 rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="px-3 py-2 text-left text-sm font-medium">
                  Periodo
                </TableHead>
                <TableHead className="px-3 py-2 text-center text-sm font-medium">
                  Nr. Ospiti soggetti ad imposta
                </TableHead>
                <TableHead className="px-3 py-2 text-center text-sm font-medium">
                  Nr. Pernottamenti soggetti ad imposta
                </TableHead>
                <TableHead className="px-3 py-2 text-center text-sm font-medium">
                  Imposta da Versare (€)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AtableData.map((row, i) => {
                return (
                  <TableRow
                    style={{
                      backgroundColor: i % 2 === 0 ? COLOR_LIGHT_BLUE : "",
                      border: "none",
                    }}
                  >
                    <TableCell
                      className={`px-3 py-2 text-sm ${row.isTotal ? "font-bold" : ""}`}
                    >
                      {row.periodo}
                    </TableCell>
                    <TableCell className=" px-3 py-2 text-center text-sm">
                      {row.NrOspiti}
                    </TableCell>
                    <TableCell className=" px-3 py-2 text-center text-sm">
                      {row.pernottamenti}
                    </TableCell>
                    <TableCell className=" px-3 py-2 text-center text-sm">
                      {row.imposta}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detailed Calculation Table 2 */}
      <div className="mb-6">
        <h3
          className="text-sm lg:text-lg font-bold mb-3"
          style={{ color: COLOR_TUNA }}
        >
          B) SOGGETTI E PERNOTTAMENTI NON IMPONIBILI (Oltre il limite di imposta
          di 8 pernottamenti)
        </h3>

        <div className="bg-white overflow-hidden border border-gray-300 rounded-md">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className=" px-3 py-2 text-left text-sm font-medium">
                  Periodo
                </TableHead>
                <TableHead className=" px-3 py-2 text-center text-sm font-medium">
                  Nr. Ospiti
                </TableHead>
                <TableHead className=" px-3 py-2 text-center text-sm font-medium">
                  Nr. Pernottamenti
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {BtableData.map((row, i) => {
                return (
                  <TableRow
                    style={{
                      backgroundColor: i % 2 === 0 ? COLOR_LIGHT_BLUE : "",
                      border: "none",
                    }}
                  >
                    <TableCell
                      className={` px-3 py-2 text-sm ${row.isTotal ? "font-bold" : ""}`}
                    >
                      {row.periodo}
                    </TableCell>
                    <TableCell className=" px-3 py-2 text-center text-sm">
                      {row.NrOspiti}
                    </TableCell>
                    <TableCell className=" px-3 py-2 text-center text-sm">
                      {row.pernottamenti}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detailed Calculation Table 3 */}
      <div className="mb-6">
        <h3 className="text-sm lg:text-lg font-bold mb-3 text-gray-800">
          C) SOGGETTI ESENTI DALL'IMPOSTA E AVENTI DIRITTO A UNA RIDUZIONE
        </h3>

        <div className="overflow-hidden bg-white border border-gray-300 rounded-md">
          <Table>
            <TableHeader>
              {/* First Header Row */}
              <TableRow>
                <TableHead
                  rowSpan={2}
                  className="px-3 py-2 text-left text-sm font-medium"
                >
                  Riduzioni
                </TableHead>

                <TableHead
                  rowSpan={2}
                  className="px-3 py-2 text-center text-sm font-medium"
                >
                  Percentuale
                </TableHead>
                <TableHead
                  colSpan={2}
                  className=" px-3 py-2 text-center text-sm font-medium"
                >
                  1. Mese
                </TableHead>
                <TableHead
                  colSpan={2}
                  className=" px-3 py-2 text-center text-sm font-medium"
                >
                  2. Mese
                </TableHead>
                <TableHead
                  colSpan={2}
                  className=" px-3 py-2 text-center text-sm font-medium"
                >
                  3. Mese
                </TableHead>
              </TableRow>

              {/* Sub-headers */}
              <TableRow>
                <TableHead className="border-t border-gray-200 px-3 py-2 text-center text-sm">
                  Ospiti
                </TableHead>
                <TableHead className="border-t border-gray-200 px-3 py-2 text-center text-sm">
                  Pernottamenti
                </TableHead>
                <TableHead className="-t border-gray-200 px-3 py-2 text-center text-sm">
                  Ospiti
                </TableHead>
                <TableHead className="border-t border-gray-200 px-3 py-2 text-center text-sm">
                  Pernottamenti
                </TableHead>
                <TableHead className="border-t border-gray-200 px-3 py-2 text-center text-sm">
                  Ospiti
                </TableHead>
                <TableHead className="border-t border-gray-200 px-3 py-2 text-center text-sm">
                  Pernottamenti
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {CtableData.map((row, i) => (
                <TableRow
                  key={row.riduzioni}
                  style={{
                    backgroundColor: i % 2 === 0 ? COLOR_LIGHT_BLUE : "",
                    border: "none",
                  }}
                >
                  <TableCell
                    className={` px-3 py-2 text-sm ${row.isTotal ? "font-bold" : ""}`}
                  >
                    {row.riduzioni}
                  </TableCell>
                  <TableCell className={` px-3 py-2 text-center text-sm`}>
                    {!row.isTotal && row.percentuale + "%"}
                  </TableCell>
                  <TableCell className=" px-3 py-2 text-center text-sm">
                    {row.mese1.ospiti}
                  </TableCell>
                  <TableCell className=" px-3 py-2 text-center text-sm">
                    {row.mese1.pernottamenti}
                  </TableCell>
                  <TableCell className=" px-3 py-2 text-center text-sm">
                    {row.mese2.ospiti}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-center text-sm">
                    {row.mese2.pernottamenti}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-center text-sm">
                    {row.mese3.ospiti}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-center text-sm">
                    {row.mese3.pernottamenti}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detailed Calculation Table 4 */}
      <div className="mb-6">
        <h3
          className="text-sm lg:text-lg font-bold mb-3"
          style={{ color: COLOR_TUNA }}
        >
          D) PRENOTAZIONI CON PIATTAFORME E/O INTERMEDIARI TURISTICI
          CONVENZIONATI CON IL COMUNE DI GENOVANTI)
        </h3>
        <div className="bg-white overflow-hidden border border-gray-300 rounded-md">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-3 py-2 text-left text-sm font-medium">
                  Periodo
                </TableHead>
                <TableHead className="px-3 py-2 text-center text-sm font-medium">
                  Numero Ospiti
                </TableHead>
                <TableHead className="px-3 py-2 text-center text-sm font-medium">
                  Numero Pernottamenti
                </TableHead>
                <TableHead className="px-3 py-2 text-center text-sm font-medium">
                  Imposta (€)
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {DtableData.map((row, i) => {
                return (
                  <TableRow
                    style={{
                      backgroundColor: i % 2 === 0 ? COLOR_LIGHT_BLUE : "",
                      border: "none",
                    }}
                  >
                    <TableCell className="px-3 py-2 text-sm">
                      {row.periodo}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm">
                      {row.numeroOspiti}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm">
                      {row.numeroPernottamenti}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm">
                      {row.imposta}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="my-5 p-2">
            <span className="text-sm">
              Denominazione piattaforme e/o intermediari turistici convenzionati
              utilizzati:
            </span>
            <Textarea className="border-gray-300" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border border-gray-300 rounded-md px-4 py-5 mt-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 sm:gap-0">
          <div className="text-sm flex flex-col items-center text-black flex-1">
            <span className="font-bold text-2xl">0</span>
            <span className="text-gray-600 text-sm text-center">
              Totale Ospiti
            </span>
          </div>
          
          <div className="text-sm flex flex-col items-center text-black flex-1">
            <span className="font-bold text-2xl">0</span>
            <span className="text-gray-600 text-sm text-center">
              Totale Pernottamenti
            </span>
          </div>
          <div className="text-sm flex flex-col items-center text-black flex-1">
            <span className="font-bold text-2xl">€0.00</span>
            <span className="text-gray-600 text-sm text-center">
              Totale riscosso da versare al Comune
            </span>
          </div>
        </div>

        <div className="my-5">
          <span className="text-sm block mb-2">Note</span>
          <Textarea className="border-gray-300 bg-white w-full" />
        </div>
      </div>
    </div>
  );
};

export default CityTaxDocument;
