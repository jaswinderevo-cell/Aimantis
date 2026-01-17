import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { BlockDatesSchema } from "@/schemas/blockDates";
import {
  CreateBlockedDatesPayload,
  useEditBlockedDates,
  useGetSingleBlockedDates,
} from "@/services/blockDates";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import { useFormStatus } from "@/utils/disableFormHook";
import { IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import { getIn, useFormik } from "formik";
import { useEffect, useMemo } from "react";

interface EditBlockDatesModalProps {
  id: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  selectedProperty?: PropertyPayload | null;
  selectedStructureId?: number | null;
}

export function EditBlockDatesModal({
  id,
  open,
  onOpenChange,
  date,
  selectedProperty,
  selectedStructureId,
}: EditBlockDatesModalProps) {
  //get single blocked date
  const getSingleBlockDate = useGetSingleBlockedDates(id);
  const singleBlockDateData = getSingleBlockDate?.data;

  const editBlockedDateMutation = useEditBlockedDates();

  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik<CreateBlockedDatesPayload>({
    enableReinitialize: true,
    validationSchema: BlockDatesSchema,
    initialValues: {
      id: singleBlockDateData ? singleBlockDateData?.id : null,
      structure: selectedStructureId ?? 0,
      property_type: selectedProperty?.property_type ?? 0,
      property: selectedProperty?.id ?? 0,
      start_date: singleBlockDateData ? singleBlockDateData?.start_date : "",
      end_date: singleBlockDateData ? singleBlockDateData?.end_date : "",
      reason: singleBlockDateData ? singleBlockDateData?.reason : "",
      notes: singleBlockDateData ? singleBlockDateData?.notes : "",
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      editBlockedDateMutation.mutate(values, {
        onSuccess: () => {
          console.log(values);
          onOpenChange(false);
          resetForm();
          setSubmitting(false);
        },
        onError: () => {
          setSubmitting(false);
          resetForm();
        },
      });
    },
  });

  const getAllRooms = useGetAllRooms();
  const allRoomsData = getAllRooms?.data || [];

  const filteredProperties = useMemo(() => {
    return allRoomsData.filter((p: PropertyPayload) => {
      const matchesStructure = selectedStructureId
        ? p.structure === selectedStructureId
        : true;

      return matchesStructure;
    });
  }, [selectedStructureId]);

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: editBlockedDateMutation.isPending,
  });

  const renderError = (fieldName: string) => {
    const error = getIn(errors, fieldName);
    return typeof error === "string" ? (
      <span className="text-start text-red-500 text-xs min-h-6">{error}</span>
    ) : (
      <span className="text-start text-red-500 text-xs min-h-6">&nbsp;</span>
    );
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] w-full max-h-[90vh] overflow-auto p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Block dates
            </h2>
            <button className="hover:bg-gray-100 rounded-lg">
              <IconX
                color="red"
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              />
            </button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={isFormDisabled}>
            <div className="space-y-4 mt-2">
              {/* Property */}
              <div className="space-y-1">
                <Label className="text-sm text-gray-700">Property</Label>
                <Select
                  value={String(values.property)}
                  onValueChange={(val) =>
                    setFieldValue("property", Number(val))
                  }
                >
                  <SelectTrigger className="text-black font-normal h-10 w-full border-gray-300 focus:outline-0 focus:ring-1">
                    <SelectValue
                      placeholder={selectedProperty?.name || "Select property"}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {filteredProperties?.map((p: PropertyPayload) => {
                      return (
                        <SelectItem
                          className="data-[highlighted]:bg-gray-100 cursor-pointer"
                          value={String(p.id)}
                        >
                          {p.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {renderError("property")}
              </div>
              <div className="flex-col flex md:flex-row gap-3">
                {/* From */}
                <div className="space-y-1">
                  <Label className="text-sm text-gray-700">From</Label>
                  <DatePicker
                    value={values.start_date ?? ""}
                    onChange={(val) => setFieldValue("start_date", val)}
                    name="start_date"
                    width=""
                  />
                  {renderError("start_date")}
                </div>

                {/* To */}
                <div className="space-y-1">
                  <Label className="text-sm text-gray-700">To</Label>
                  <DatePicker
                    value={values.end_date ?? ""}
                    onChange={(val) => setFieldValue("end_date", val)}
                    name="end_date"
                  />
                  {renderError("end_date")}
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1">
                <Label
                  htmlFor="reason"
                  className="text-[14px] font-medium block text-gray-700"
                >
                  Reason for block
                </Label>
                <textarea
                  value={values.reason ?? ""}
                  id="reason"
                  name="reason"
                  onChange={handleChange}
                  placeholder="Write here..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-vertical min-h-[100px] focus:outline-0 focus:ring-1"
                />
              </div>

              <DialogFooter className="mt-5">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-gray-100"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>

                <Button
                  className="btn"
                  type="submit"
                  disabled={editBlockedDateMutation.isPending}
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
