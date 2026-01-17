import { InvoiceDashboardTable } from "@/components/InvoiceDashboardTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  COLOR_ATHENS_GRAY,
  COLOR_LIGHT_GREEN,
  COLOR_LIGHT_SILVER,
  COLOR_VIOLET,
} from "@/constants/constants";
import { Search } from "lucide-react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

export type InvoicePayload = {
  id: string;
  number: string;
  date: string;
  client: string;
  clientMeta?: string;
  note?: string;
  status: "sent" | "delivered" | "accepted" | "rejected";
  amount: string;
  paid: boolean;
};

const statsArr = [
  { label: "Vendite", price: "108.963", tag: "YTD" },
  { label: "Pagamenti entrata", price: "112.938", tag: "YTD" },
  { label: "Acquisti", price: "135.570", tag: "YTD" },
  { label: "Tributi", price: "0", tag: "YTD" },
];

export const invoices: InvoicePayload[] = [
  {
    id: "1",
    number: "INV-0181",
    date: "06/09/2025",
    client: "Patrycja Pociejewska",
    clientMeta: "PL • P.IVA 105998816",
    note: "Invoice for your stay",
    status: "delivered",
    amount: "€ 534,70",
    paid: true,
  },
  {
    id: "2",
    number: "INV-0180",
    date: "04/09/2025",
    client: "Szlavik Zsolt Andras",
    note: "Invoice for your stay",
    status: "accepted",
    amount: "€ 750,93",
    paid: true,
  },
  {
    id: "3",
    number: "INV-0176",
    date: "30/08/2025",
    client: "Mohamed Qadchaoui",
    note: "Invoice for your stay",
    status: "sent",
    amount: "€ 205,62",
    paid: true,
  },
  {
    id: "4",
    number: "INV-0169",
    date: "17/08/2025",
    client: "Dake Takuro",
    note: "Invoice for your stay",
    status: "rejected",
    amount: "€ 329,01",
    paid: true,
  },
];

function StatusPill({ status }: { status: InvoicePayload["status"] }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border";
  switch (status) {
  case "delivered":
    return (
      <span
        className={`${base} bg-blue-900/20 border-blue-800 text-blue-200`}
      >
          Consegnata
      </span>
    );
  case "accepted":
    return (
      <span
        className={`${base} bg-green-900/20 border-green-700 text-green-200`}
      >
          Accettata
      </span>
    );
  case "sent":
    return (
      <span className={`${base} bg-sky-900/20 border-sky-700 text-sky-200`}>
          Inviata (MC)
      </span>
    );
  case "rejected":
    return (
      <span
        className={`${base} bg-red-900/20 border-red-700 text-red-200`}
        title="00324: Codice destinatario non valido"
      >
          Scartata
      </span>
    );
  default:
    return <span className={base}>{status}</span>;
  }
}

const DashboardTab = () => {
  return (
    <div
      className="min-h-screen text"
      style={{ borderColor: COLOR_ATHENS_GRAY }}
    >
      <div className="mx-auto min-h-screen">
        {/* Main content */}
        <main className="p-5">
          {/* Topbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-transparent py-2">
            <div className="relative w-full md:w-fit">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cerca documenti, clienti…"
                className="pl-10 text-black bg-white"
                style={{ borderColor: COLOR_LIGHT_SILVER }}
              />
            </div>

            <Button className="px-4 py-2 btn">
              Periodo: 01 GEN – 31 DIC 2025 ▾
            </Button>
          </div>

          {/* KPIs */}
          <div className="overflow-x-auto scr pb-2 scrollbar-hidden mt-6">
            <div className="flex gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 scrollbar-hidden">
              {statsArr.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white p-4 shadow rounded-md min-w-[170px] lg:min-w-[220px] flex-shrink-0"
                  >
                    <div className="flex flex-col gap-1 items-start">
                      <p className="text-[17px] text-gray-700 font-medium">
                        {item.label}
                      </p>
                      <p
                        className="font-bold text-xl"
                        style={{ color: COLOR_VIOLET }}
                      >
                        {item.price}
                      </p>
                      <p className="text-xs text-gray-700">{item.tag}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chips */}
          <div className="flex flex-col gap-2 mt-4 lg:flex-row">
            <div className="flex flex-col sm:flex-row gap-2 ">
              <span className="px-3 py-2 w-full sm:w-fit text-center rounded-full text-sm text-white bg-slate-800 border border-slate-700">
                Da inviare a SDI: 0
              </span>
              <span className="px-3 py-2 w-full sm:w-fit text-center rounded-full text-sm bg-sky-100 border border-sky-600 text-sky-600">
                Inviate a SDI: 1
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 ">
              <span
                className="px-3 py-2 w-full sm:w-fit text-center rounded-full text-sm border border-[#166534]"
                style={{
                  color: "#166534",
                  backgroundColor: COLOR_LIGHT_GREEN,
                }}
              >
                Consegnate/Accettate SDI: 2
              </span>
              <span className="px-3 py-2 w-full sm:w-fit text-center rounded-full text-sm bg-red-100 border border-red-600 text-red-600">
                Scartate/Rifiutate SDI: 1
              </span>
              <span className="px-3 py-2 w-full sm:w-fit text-center rounded-full text-sm text-white bg-slate-800 border border-slate-700">
                Altro: 0
              </span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between mt-6">
            <div className="flex flex-wrap w-full gap-2">
              <Button className="px-4 w-full md:w-fit py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-900 font-bold">
                NUOVO
              </Button>
              <Button className="px-4 w-full md:w-fit py-2 rounded-lg text-white bg-slate-800 border border-slate-700 flex items-center gap-2 hover:bg-slate-700">
                ALTRO
                <IoMdArrowDropdown className="text-lg" />
              </Button>
            </div>
            <div className="w-full flex justify-end">
              <Button className="w-full md:w-fit px-4 py-2 rounded-lg text-white bg-slate-800 border border-slate-700 flex items-center gap-2 hover:bg-slate-700">
                Filtri
                <IoMdArrowDropright className="text-lg" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <section className="p-4 rounded-lg mt-6 bg-white">
            <InvoiceDashboardTable invoices={invoices} />
          </section>

          {/* Editor teaser */}
          <section className="bg-white p-4 rounded-lg mt-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-black">
                  Editor documento (anteprima)
                </h3>
                <div className="text-gray-500 text-sm sm:text-base mt-1">
                  Apri “INV-0181” per modificare DATI, NOTE, PAGAMENTI,
                  ALLEGATI, EMAIL
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm sm:text-base">
                  Genera PDF
                </Button>
                <Button className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm sm:text-base">
                  Invia email
                </Button>
                <Button className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm sm:text-base">
                  Verifica stato SDI
                </Button>
                <Button className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-900 font-bold text-sm sm:text-base">
                  Invia a SDI
                </Button>
              </div>
            </div>

            {/* Tags / Chips */}
            <div className="mt-6">
              <div className="flex scr gap-2 sm:gap-3 overflow-x-auto whitespace-nowrap py-2">
                {[
                  "Numero: INV-0181",
                  "Tipo: Fattura TD01",
                  "Esigibilità IVA: Immediata",
                  "Bollo: Non presente",
                ].map((label) => (
                  <span
                    key={label}
                    className="inline-block px-2 sm:px-3 py-1 sm:py-2 rounded-full text-white bg-slate-800 border border-slate-700 text-sm sm:text-base"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Table and Totals */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              {/* Table */}
              <div className="md:col-span-8 bg-white p-3 sm:p-4 border rounded-lg overflow-x-auto">
                <div className="text-gray-600 text-sm mb-2">Righe</div>
                <Table className="text-sm min-w-[500px] sm:min-w-full">
                  <TableHeader>
                    <TableRow className="text-slate-400 text-xs sm:text-sm">
                      <TableHead className="text-left">Descrizione</TableHead>
                      <TableHead>Q.tà</TableHead>
                      <TableHead>Prezzo netto</TableHead>
                      <TableHead>IVA%</TableHead>
                      <TableHead className="text-right">Totale</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        Pagamento locazione turistica — Via Venti, Genova
                      </TableCell>
                      <TableCell>1,00</TableCell>
                      <TableCell className="tabular-nums">€ 458,82</TableCell>
                      <TableCell>10%</TableCell>
                      <TableCell className="text-right tabular-nums">
                        € 458,82
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="md:col-span-4 bg-white p-3 sm:p-4 border rounded-lg">
                <div className="text-gray-600 text-sm mb-2">Totali</div>
                <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
                  <div>Imponibile</div>
                  <div className="tabular-nums">€ 458,82</div>
                  <div>IVA</div>
                  <div className="tabular-nums">€ 45,88</div>
                  <div>Bollo</div>
                  <div className="tabular-nums">€ 0,00</div>
                  <div className="border-t border-dashed pt-2 font-semibold">
                    Totale
                  </div>
                  <div className="tabular-nums border-t border-dashed pt-2 font-semibold">
                    € 504,70
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardTab;
