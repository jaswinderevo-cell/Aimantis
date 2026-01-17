import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { COLOR_LIGHT_GRAY } from "@/constants/constants";
import {
  CheckinFormField,
  useCreateCheckinTemplate,
  useDefaultCheckinFields,
} from "@/services/onlineCheckinForm";
import { IconX } from "@tabler/icons-react";
import { FieldArray, Form, Formik } from "formik";
import { Plus, Trash2 } from "lucide-react";
import { TbDeviceFloppy } from "react-icons/tb";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { normalizeSlug } from "@/utils/helper";

export default function CustomCheckinFormTemplate({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  //get default checkin fields
  const { data } = useDefaultCheckinFields();

  //create new checkin
  const createTemplate = useCreateCheckinTemplate();

  if (!data) return null;

  const buildInitialSection = (fields: CheckinFormField[]) =>
    fields.reduce<Record<string, boolean>>((acc, f) => {
      acc[f.slug] = false;
      return acc;
    }, {});

  const SELECT_CHOICES_MAP: Record<string, string[]> = {
    gender: ["male", "female", "other"],
    document_type: ["passport", "id_card", "drivers_license"],
  };

  const buildSectionPayload = (
    defaults: CheckinFormField[],
    enabledMap: Record<string, boolean>,
    customFields: CheckinFormField[],
    section: "main_guest" | "additional_guest",
  ) => {
    return [
      ...defaults
        .filter((f) => enabledMap[f.slug])
        .map((f) => ({
          slug: f.slug,
          label: f.label,
          type: f.type,
          required: false,
          ...(f.type === "select"
            ? { choices: f.choices ?? SELECT_CHOICES_MAP[f.slug] ?? [] }
            : {}),
          category: f.category,
          section,
        })),

      ...customFields.map((f) => ({
        slug: normalizeSlug(f.slug),
        label: f.label,
        type: f.type,
        required: f.required ?? false,
        choices: f.type === "select" ? (f.choices ?? []) : undefined,
        category: "Custom",
        section,
      })),
    ];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-auto p-5">
        <Formik
          initialValues={{
            name: "Default Hotel Check-in",
            description: "",
            main_guest: buildInitialSection(data.sections.main_guest),
            additional_guest: buildInitialSection(
              data.sections.additional_guest,
            ),
            custom_main: [] as CheckinFormField[],
            custom_additional: [] as CheckinFormField[],
          }}
          onSubmit={(values) => {
            createTemplate.mutate(
              {
                name: values.name,
                description: values.description,
                sections: {
                  main_guest: buildSectionPayload(
                    data.sections.main_guest,
                    values.main_guest,
                    values.custom_main,
                    "main_guest",
                  ),
                  additional_guest: buildSectionPayload(
                    data.sections.additional_guest,
                    values.additional_guest,
                    values.custom_additional,
                    "additional_guest",
                  ),
                },
              },
              {
                onSuccess: () => {
                  onOpenChange(false);
                },
              },
            );
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-10">
              {/* HEADER */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h1 className="text-xl font-semibold">
                    Online check-in settings
                  </h1>
                  <p className="text-sm text-gray-600 max-w-2xl mt-1">
                    Please select the data to request during online check-in.
                    You may differentiate between the main guest and others.
                  </p>
                </div>

                <button type="button" className="hover:bg-gray-100 rounded-lg">
                  <IconX
                    color="red"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => onOpenChange(false)}
                  />
                </button>
              </div>

              {/* FORM NAME */}
              <div className="max-w-lg space-y-1">
                <label className="text-sm font-medium">Update Form name</label>
                <Input
                  className="text-black font-normal h-10 w-full text-[16px]"
                  style={{ borderColor: COLOR_LIGHT_GRAY }}
                  value={values.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  placeholder="Default Hotel Check-in"
                />
              </div>

              {/* MAIN GUEST */}
              <Section
                title="Main guest"
                sectionKey="main_guest"
                fields={data.sections.main_guest}
                values={values.main_guest}
                onChange={setFieldValue}
                customName="custom_main"
              />

              {/* ADDITIONAL GUEST */}
              <Section
                title="Additional guests"
                sectionKey="additional_guest"
                fields={data.sections.additional_guest}
                values={values.additional_guest}
                onChange={setFieldValue}
                customName="custom_additional"
              />

              {/* DESCRIPTION */}
              <div className="space-y-2 max-w-3xl">
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-gray-500">
                  This text will appear on the online check-in page.
                </p>
                <Textarea
                  rows={5}
                  value={values.description}
                  style={{ borderColor: COLOR_LIGHT_GRAY }}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                  placeholder="Optional instructions for guests..."
                />
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-gray-100"
                  onClick={() => onOpenChange(false)}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  className="btn text-[14px] w-full sm:w-auto min-w-[120px]"
                  disabled={createTemplate.isPending}
                >
                  <TbDeviceFloppy className="mr-2" size={16} />
                  {createTemplate.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

/* SECTION COMPONENT */

function Section({
  title,
  sectionKey,
  fields,
  values,
  onChange,
  customName,
}: {
  title: string;
  sectionKey: "main_guest" | "additional_guest";
  fields: CheckinFormField[];
  values: Record<string, boolean>;
  onChange: (name: string, value: boolean) => void;
  customName: string;
}) {
  const grouped = fields.reduce<Record<string, CheckinFormField[]>>(
    (acc, field) => {
      const category = field.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(field);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-6 border rounded-lg p-5 bg-gray-50">
      <h2 className="font-semibold text-base">{title}</h2>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-6">
            {items.map((f) => (
              <label
                key={f.slug}
                className="flex items-center gap-2 text-sm"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                <Checkbox
                  checked={values[f.slug]}
                  onCheckedChange={(v) =>
                    onChange(`${sectionKey}.${f.slug}`, v === true)
                  }
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* CUSTOM FIELDS */}
      <FieldArray name={customName}>
        {(helpers) => (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">Custom fields</h4>

            {helpers.form.values[customName].map((_: string, i: number) => (
              <div key={i} className="flex gap-3 items-center">
                <Input
                  className="flex-1"
                  placeholder="Label"
                  onChange={(e) =>
                    helpers.form.setFieldValue(
                      `${customName}.${i}.label`,
                      e.target.value,
                    )
                  }
                />
                <Input
                  className="flex-1"
                  placeholder="Slug (e.g. birth_date)"
                  onChange={(e) =>
                    helpers.form.setFieldValue(
                      `${customName}.${i}.slug`,
                      normalizeSlug(e.target.value),
                    )
                  }
                />

                <Button
                  type="button"
                  className="flex items-center text-red-400 rounded hover:bg-gray-50 hover:text-red-500"
                  variant="ghost"
                  onClick={() => helpers.remove(i)}
                >
                  <Trash2 size={19} style={{ strokeWidth: "2.5px" }} />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              className="text-primary"
              onClick={() =>
                helpers.push({
                  slug: "",
                  label: "",
                  type: "text",
                  required: false,
                  choices: [],
                  meta: {
                    category: "Custom",
                    section: sectionKey,
                  },
                })
              }
            >
              <Plus size={14} className="mr-1" />
              Add custom field
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
