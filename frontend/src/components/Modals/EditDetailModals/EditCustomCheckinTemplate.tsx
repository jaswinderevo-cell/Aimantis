import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Formik, Form, FieldArray } from "formik";
import { Plus, Trash2 } from "lucide-react";
import { IconX } from "@tabler/icons-react";
import {
  CheckinFieldType,
  CheckinFormField,
  CustomField,
  useCreateCheckinTemplate,
  useDefaultCheckinFields,
  useGetCheckinTemplateById,
  useUpdateCheckinTemplate,
} from "@/services/onlineCheckinForm";
import { TbDeviceFloppy } from "react-icons/tb";
import { COLOR_LIGHT_GRAY } from "@/constants/constants";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

// type CheckinFormField = {
//   slug: string;
//   label: string;
//   type: CheckinFieldType;
//   required: boolean;
//   choices?: string[];
//   meta: {
//     category: string;
//     section: "main_guest" | "additional_guest";
//   };
// };

/* ================= COMPONENT ================= */

export default function UpdateCustomCheckinTemplate({
  open,
  onOpenChange,
  editingTemplateId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTemplateId: number | null;
}) {
  const { data } = useDefaultCheckinFields();
  const templateQuery = useGetCheckinTemplateById(editingTemplateId);

  const createTemplate = useCreateCheckinTemplate();
  const updateTemplate = useUpdateCheckinTemplate();

  if (!data) return null;

  const isEdit = !!templateQuery.data;

  /* ============ NORMALIZATION ============ */

  const normalizeFields = (fields: CheckinFormField[]): CheckinFormField[] =>
    fields.map((f) => ({
      ...f,
      ...(f.type === "select" ? { choices: f.choices ?? [] } : {}),
    }));

  const defaultMain = normalizeFields(data.sections.main_guest);
  const defaultAdditional = normalizeFields(data.sections.additional_guest);

  const templateMain = isEdit
    ? normalizeFields(templateQuery.data.sections.main_guest)
    : [];

  const templateAdditional = isEdit
    ? normalizeFields(templateQuery.data.sections.additional_guest)
    : [];

  /* ============ HELPERS ============ */

  const buildInitialSection = (fields: CheckinFormField[]) =>
    fields.reduce<Record<string, boolean>>((acc, f) => {
      acc[f.slug] = false;
      return acc;
    }, {});

  const buildEnabledMap = (
    defaults: CheckinFormField[],
    selected: CheckinFormField[],
  ) => {
    const selectedSlugs = new Set(selected.map((f) => f.slug));
    return defaults.reduce<Record<string, boolean>>((acc, f) => {
      acc[f.slug] = selectedSlugs.has(f.slug);
      return acc;
    }, {});
  };

  const extractCustomFields = (
    defaults: CheckinFormField[],
    selected: CheckinFormField[],
  ) => {
    const defaultSlugs = new Set(defaults.map((f) => f.slug));
    return selected.filter((f) => !defaultSlugs.has(f.slug));
  };

  const SELECT_CHOICES_MAP: Record<string, string[]> = {
    gender: ["male", "female", "other"],
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
        slug: f.slug,
        label: f.label,
        type: f.type,
        required: f.required ?? false,
        ...(f.type === "select" ? { choices: resolveChoices(f) } : {}),
        category: "Custom",
        section,
      })),
    ];
  };

  const resolveChoices = (f: CheckinFormField): string[] => {
    if (Array.isArray(f.choices) && f.choices.length) return f.choices;
    return SELECT_CHOICES_MAP[f.slug] ?? [];
  };

  /* ============ INITIAL VALUES ============ */

  const initialValues = isEdit
    ? {
        name: templateQuery.data.template.name,
        description: templateQuery.data.template.description ?? "",

        main_guest: buildEnabledMap(defaultMain, templateMain),
        additional_guest: buildEnabledMap(
          defaultAdditional,
          templateAdditional,
        ),

        custom_main: extractCustomFields(defaultMain, templateMain),
        custom_additional: extractCustomFields(
          defaultAdditional,
          templateAdditional,
        ),
      }
    : {
        name: "Default Hotel Check-in",
        description: "",
        main_guest: buildInitialSection(defaultMain),
        additional_guest: buildInitialSection(defaultAdditional),
        custom_main: [],
        custom_additional: [],
      };

  /* ============ RENDER ============ */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-auto p-5">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={(values) => {
            const payload = {
              name: values.name,
              description: values.description,
              sections: {
                main_guest: buildSectionPayload(
                  defaultMain,
                  values.main_guest,
                  values.custom_main,
                  "main_guest",
                ),
                additional_guest: buildSectionPayload(
                  defaultAdditional,
                  values.additional_guest,
                  values.custom_additional,
                  "additional_guest",
                ),
              },
            };

            if (isEdit) {
              updateTemplate.mutate(
                {
                  id: templateQuery.data.template.id,
                  ...payload,
                },
                { onSuccess: () => onOpenChange(false) },
              );
            } else {
              createTemplate.mutate(payload, {
                onSuccess: () => onOpenChange(false),
              });
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-10">
              {/* HEADER */}
              <div className="flex justify-between items-start border-b pb-4">
                <h1 className="text-xl font-semibold">
                  Online check-in settings
                </h1>
                <IconX
                  color="red"
                  className="cursor-pointer"
                  onClick={() => onOpenChange(false)}
                />
              </div>

              {/* NAME */}
              <Input
                value={values.name}
                onChange={(e) => setFieldValue("name", e.target.value)}
                style={{ borderColor: COLOR_LIGHT_GRAY }}
              />

              {/* MAIN GUEST */}
              <Section
                title="Main guest"
                sectionKey="main_guest"
                fields={defaultMain}
                values={values.main_guest}
                onChange={setFieldValue}
                customName="custom_main"
              />

              {/* ADDITIONAL GUEST */}
              <Section
                title="Additional guests"
                sectionKey="additional_guest"
                fields={defaultAdditional}
                values={values.additional_guest}
                onChange={setFieldValue}
                customName="custom_additional"
              />

              {/* DESCRIPTION */}
              <Textarea
                rows={5}
                value={values.description}
                onChange={(e) => setFieldValue("description", e.target.value)}
              />

              {/* FOOTER */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  className="btn text-[14px] w-full sm:w-auto min-w-[120px]"
                  disabled={updateTemplate.isPending}
                >
                  <TbDeviceFloppy className="mr-2" size={16} />
                  {updateTemplate.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

/* ================= SECTION ================= */

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
    (acc, f) => {
      acc[f.category] ||= [];
      acc[f.category].push(f);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-6 border rounded-lg p-5 bg-gray-50">
      <h2 className="font-semibold">{title}</h2>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h4 className="text-sm font-medium mb-2">{category}</h4>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((f) => (
              <label key={f.slug} className="flex items-center gap-2">
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
            {helpers.form.values[customName].map(
              (_: CustomField, i: number) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={helpers.form.values[customName][i].label}
                    onChange={(e) =>
                      helpers.form.setFieldValue(
                        `${customName}.${i}.label`,
                        e.target.value,
                      )
                    }
                    placeholder="Label"
                  />
                  <Input
                    value={helpers.form.values[customName][i].slug}
                    onChange={(e) =>
                      helpers.form.setFieldValue(
                        `${customName}.${i}.slug`,
                        e.target.value,
                      )
                    }
                    placeholder="Slug"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => helpers.remove(i)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ),
            )}

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                helpers.push({
                  slug: "",
                  label: "",
                  type: "text",
                  required: false,
                  meta: { category: "Custom", section: sectionKey },
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
