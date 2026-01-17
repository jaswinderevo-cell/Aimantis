import React, { useEffect, useState } from "react";
import { Shield, FileText, User } from "lucide-react";
import { getIn, useFormik } from "formik";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { IconX, IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { TbDeviceFloppy } from "react-icons/tb";
import { AgenziaSchema } from "@/schemas/agenzia";
import { toast } from "sonner";

interface AgenziaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AgenziaModal: React.FC<AgenziaModalProps> = ({ open, onOpenChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const {
    values,
    errors,
    handleBlur,
    resetForm,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik({
    validationSchema: AgenziaSchema,
    initialValues: {
      // Step 1 - Credentials
      credentialName: "",
      activation: "",
      intermediary: "",

      // Step 2 - Fiscal Data
      name: "",
      lastName: "",
      vatNumber: "",
      fiscalCode: "",
      fiscalAddress: "",
      city: "",
      region: "",
      country: "",
      pecEmail: "",

      // Step 3 - Contract Signing
      contractAccept: "",
      serviceAgreement: false,
      civilCodeApproval: false,
      privacyNotice: false,
    },

    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      console.log(values);
      try {
        toast.success("Form submitted successfully!");
        resetForm();
        setCurrentStep(1);
        onOpenChange(false);
        setSubmitting(false);
      } catch (error) {
        toast.error("Something went wrong", {
          description: (error as Error).message,
        });
      }
    },
  });

  useEffect(() => {
    if (!open) {
      resetForm();
      setCurrentStep(1);
    }
  }, [open]);

  //show fields errors//
  const renderError = (field: string) => {
    const error = getIn(errors, field);
    return typeof error === "string" ? (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        {error}
      </span>
    ) : (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        &nbsp;
      </span>
    );
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
    case 1: // Credentials
      return (
        values.credentialName.trim() !== "" &&
          values.activation !== "" &&
          values.intermediary.trim() !== ""
      );
    case 2: // Fiscal Data
      return (
        values.name.trim() !== "" &&
          values.lastName.trim() !== "" &&
          values.vatNumber.trim() !== "" &&
          values.fiscalCode.trim() !== "" &&
          values.fiscalAddress.trim() !== "" &&
          values.city.trim() !== "" &&
          values.region.trim() !== "" &&
          values.country.trim() !== "" &&
          values.pecEmail.trim() !== ""
      );
    case 3: // Contract Signing
      return (
        values.serviceAgreement &&
          values.civilCodeApproval &&
          values.privacyNotice
      );
    default:
      return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    } else {
      alert("Please fill in all required fields before proceeding.");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Step 1 - Credentials
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-gray-700" />
        <h3 className="text-base font-medium text-gray-900">Credentials</h3>
      </div>

      <div className="space-y-4">
        {/* Credential Name */}
        <div className="space-y-2">
          <Label
            htmlFor="credentialName"
            className="text-sm font-normal text-gray-700"
          >
            Credential Name
          </Label>
          <Input
            id="credentialName"
            type="text"
            placeholder="Credential Name"
            value={values.credentialName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full h-10 px-3 border-gray-300"
            style={{ fontSize: "17px" }}
          />
          {renderError("credentialName")}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="activation"
            className="text-sm font-normal text-gray-700"
          >
            Activation
          </Label>
          <Select
            value={values.activation}
            onValueChange={(value) => setFieldValue("activation", value)}
          >
            <SelectTrigger
              className="w-full text-[17px] border-gray-300 data-[placeholder]:text-gray-600"
              style={{ height: "40px" }}
            >
              <SelectValue placeholder="Select Activation type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem
                className="cursor-pointer data-[highlighted]:bg-gray-100"
                value="Yes"
              >
                Yes
              </SelectItem>
              <SelectItem
                className="cursor-pointer data-[highlighted]:bg-gray-100"
                value="No"
              >
                No
              </SelectItem>
            </SelectContent>
          </Select>
          {renderError("activation")}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="intermediary"
            className="text-sm font-normal text-gray-700"
          >
            Intermediary *
          </Label>

          <Input
            id="intermediary"
            name="intermediary"
            placeholder="Almantis/None"
            value={values.intermediary}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full h-10 px-3 text-sm border-gray-300"
          />
          {renderError("intermediary")}
        </div>
      </div>
    </div>
  );

  // Step 2 - Fiscal Data
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-gray-700" />
        <h3 className="text-base font-medium text-gray-900">Fiscal Data</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-normal text-gray-700">
            Name *
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-10  border-gray-300"
          />
          {renderError("name")}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-sm font-normal text-gray-700"
          >
            Last Name *
          </Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-10  border-gray-300"
          />
          {renderError("lastName")}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="vatNumber"
            className="text-sm font-normal text-gray-700"
          >
            VAT Number *
          </Label>
          <Input
            id="vatNumber"
            name="vatNumber"
            placeholder="BCA54321"
            value={values.vatNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-10  border-gray-300"
          />
          {renderError("vatNumber")}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="fiscalCode"
            className="text-sm font-normal text-gray-700"
          >
            Fiscal Code *
          </Label>
          <Input
            id="fiscalCode"
            name="fiscalCode"
            placeholder="ABC1234"
            value={values.fiscalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-10  border-gray-300"
          />
          {renderError("fiscalCode")}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="fiscalAddress"
          className="text-sm font-normal text-gray-700"
        >
          Fiscal Address *
        </Label>
        <Input
          id="fiscalAddress"
          name="fiscalAddress"
          placeholder="Enter fiscal address"
          value={values.fiscalAddress}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-10  border-gray-300"
        />
        {renderError("fiscalAddress")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-normal text-gray-700">
            City *
          </Label>
          <Input
            id="city"
            name="city"
            placeholder="Genoa"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-10  border-gray-300"
          />
          {renderError("city")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="text-sm font-normal text-gray-700">
            Region *
          </Label>
          <Input
            id="region"
            name="region"
            placeholder="Liguria"
            value={values.region}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-10  border-gray-300"
          />
          {renderError("region")}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="country"
            className="text-sm font-normal text-gray-700"
          >
            Country *
          </Label>
          <Input
            id="country"
            name="country"
            placeholder="Italy"
            value={values.country}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-10  border-gray-300"
          />
          {renderError("country")}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pecEmail" className="text-sm font-normal text-gray-700">
          PEC Email *
        </Label>
        <Input
          id="pecEmail"
          name="pecEmail"
          type="email"
          placeholder="email@pec.com"
          value={values.pecEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-10  border-gray-300"
        />
        {renderError("pecEmail")}
      </div>
    </div>
  );

  // Step 3 - Contract Signing
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-gray-700" />
        <h3 className="text-base font-medium text-gray-900">
          Contract Signing
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-700 mb-2 block">
            Contract to accept
          </Label>
          <div className="bg-gray-50 p-4 rounded-lg border max-h-60 overflow-y-auto">
            <div className="text-sm text-gray-800 mb-3">
              <strong>Almantis LLC "Piattaforma"</strong>, e
            </div>
            <div className="prose max-w-none text-sm">
              <ul className="list-disc pl-5 space-y-2">
                <li>Aimantis (di seguito, "Piattaforma");</li>
                <li>
                  L'utente che si registra e attiva il servizio nell'App,
                  identificato dai dati forniti in fase di registrazione (di
                  seguito, "Utente").
                </li>
                <li>Piattaforma e Utente congiuntamente, le "Parti".</li>
              </ul>

              <ol className="list-decimal pl-5 mt-6 space-y-4">
                <li>
                  <span className="font-semibold">Oggetto</span>
                  <ol className="list-decimal pl-6 mt-2 space-y-2">
                    <li>
                      Il presente contratto disciplina l'utilizzo, da parte
                      dell'Utente, della funzionalità dell'App che consente la
                      generazione, gestione e trasmissione di file FatturaPA al
                      Sistema di Interscambio (SdI) dell'Agenzia delle Entrate.
                    </li>
                    <li>
                      Il servizio ha natura tecnico-informativa e non
                      costituisce consulenza fiscale, contabile o legale.
                    </li>
                  </ol>
                </li>

                <li>
                  <span className="font-semibold">Attivazione e deleghe</span>
                  <ol className="list-decimal pl-6 mt-2 space-y-2">
                    <li>
                      L'Utente attiva il servizio accedendo all'App, accettando
                      il presente contratto e fornendo le eventuali deleghe.
                    </li>
                    <li>
                      L'Utente autorizza la Piattaforma a trasmettere a SdI le
                      fatture elettroniche e a ricevere/mostrare le notifiche.
                    </li>
                  </ol>
                </li>

                <li>
                  <span className="font-semibold">Obblighi dell'Utente</span>
                  <ol className="list-decimal pl-6 mt-2 space-y-2">
                    <li>
                      L'Utente è unico responsabile di correttezza, completezza
                      e conformità dei dati inseriti, generazione di documenti
                      nei termini di legge, sicurezza delle credenziali.
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="serviceAgreement"
              checked={values.serviceAgreement}
              onCheckedChange={(checked) =>
                setFieldValue("serviceAgreement", checked)
              }
              className="mt-1"
            />
            <Label
              htmlFor="serviceAgreement"
              className="text-sm text-gray-700 leading-relaxed"
            >
              I accept the "Service Agreement for Sending Electronic Invoices to
              the Italian Revenue Agency" (SdI).*
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="civilCodeApproval"
              checked={values.civilCodeApproval}
              onCheckedChange={(checked) =>
                setFieldValue("civilCodeApproval", checked)
              }
              className="mt-1"
            />
            <Label
              htmlFor="civilCodeApproval"
              className="text-sm text-gray-700 leading-relaxed"
            >
              Pursuant to Articles 1341-1342 of the Italian Civil Code, I
              expressly approve the following clauses: 3 (User Obligations), 5
              (Limitation of Liability), 7 (Term and Termination).*
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacyNotice"
              checked={values.privacyNotice}
              onCheckedChange={(checked) =>
                setFieldValue("privacyNotice", checked)
              }
              className="mt-1"
            />
            <Label
              htmlFor="privacyNotice"
              className="text-sm text-gray-700 leading-relaxed"
            >
              I have read the Privacy Notice and I accept "Annex A – Data
              Processing Agreement."*
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    case 3:
      return renderStep3();
    default:
      return renderStep1();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto p-0 gap-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b flex-shrink-0">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Add a new credential
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <IconX className="h-5 w-5 text-red-500" />
          </button>
        </div>

        {/* Pagination Steps */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-2 gap-4 py-4 bg-gray-50 flex-shrink-0">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors disabled:cursor-not-allowed"
            >
              <IconChevronLeft
                className={`h-5 w-5 ${currentStep === 1 ? "text-gray-200" : "text-gray-600"}`}
              />
            </button>
            <div className="flex items-center justify-center gap-4 py-4 bg-gray-50 flex-shrink-0">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                (step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                        step === currentStep
                          ? "bg-blue-100 text-blue-800"
                          : "text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                ),
              )}
            </div>
            <button
              onClick={handleNext}
              disabled={currentStep === totalSteps && !validateCurrentStep()}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors disabled:cursor-not-allowed"
            >
              <IconChevronRight
                className={`h-5 w-5 ${currentStep === totalSteps && !validateCurrentStep() ? "text-gray-200" : "text-gray-600"}`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {renderCurrentStep()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 pt-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="px-6 h-10"
                >
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-4 justify-end mt-7 mb-3">
              <Button
                type={currentStep === totalSteps ? "submit" : "button"}
                className="btn text-[14px]"
                onClick={() => {
                  if (currentStep === totalSteps) return;
                  handleNext();
                }}
                disabled={!validateCurrentStep()}
              >
                {currentStep === totalSteps ? (
                  <>
                    <TbDeviceFloppy className="mr-2" />
                    Save
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgenziaModal;
