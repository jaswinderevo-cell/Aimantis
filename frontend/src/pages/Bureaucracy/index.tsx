"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  COLOR_ATHENS_GRAY,
  COLOR_EBONY,
  COLOR_LIGHT_BLUE,
} from "@/constants/constants";
import { FileText } from "lucide-react";
import { useState } from "react";
import { PiShieldStarLight } from "react-icons/pi";
import Allogiati from "./Allogiati";
import Istat from "./Istat";
import Agenzia from "./Agenzia";
import { HiOutlineTv } from "react-icons/hi2";
import SharedBreadCrumb from "@/utils/sharedBreadCrumb";

export function Bureaucracy() {
  const [activeMainTab, setActiveMainTab] = useState("alloggiati");

  return (
    <div className="min-h-screen " style={{ backgroundColor: COLOR_LIGHT_BLUE }}>
      <SharedBreadCrumb />
      <div className={`px-[24px] py-[30px]`}>
        <Tabs
          value={activeMainTab}
          onValueChange={setActiveMainTab}
          className="space-y-[24px]"
        >
          <TabsList
            className="grid w-full h-[40px] grid-cols-3"
            style={{ backgroundColor: COLOR_ATHENS_GRAY }}
          >
            <TabsTrigger
              value="alloggiati"
              className="flex items-center justify-center gap-2"
            >
              <PiShieldStarLight className="h-4 w-4" />
              <p
                className="hidden sm:block font-medium"
                style={{ color: COLOR_EBONY, fontSize: "13px" }}
              >
                Alloggiati
              </p>
            </TabsTrigger>

            <TabsTrigger
              value="istat"
              className="flex items-center justify-center gap-2"
            >
              <HiOutlineTv className="h-4 w-4" />
              <span className="hidden sm:block">ISTAT</span>
            </TabsTrigger>

            <TabsTrigger
              value="agencia"
              className="flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:block">Agenzia Delle Entrate</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alloggiati" className="mt-0">
            <Allogiati />
          </TabsContent>

          <TabsContent value="istat" className="mt-0">
            <Istat />
          </TabsContent>

          <TabsContent value="agencia" className="mt-0">
            <Agenzia />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
