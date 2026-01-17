import * as Yup from "yup";

export const AddstructureSchema = Yup.object({
  name: Yup.string().required("Structure name is required"),
  structure_type: Yup.string().required("Structure type is required"),
  street_address: Yup.string().required("Address is required"),
  zip_code: Yup.string().required("Zip code is required"),
  country: Yup.string().required("Country is required"),
  default_currency: Yup.string().required("Currency is required"),
  internal_reference_code: Yup.string(),
  legal_entity_name: Yup.string(),
  tax_id_vat_number: Yup.number(),
  default_language: Yup.string(),
  time_zone: Yup.string(),
  default_check_in_time: Yup.string(),
  default_check_out_time: Yup.string(),
  image: Yup.array(),
});
