import * as Yup from "yup";

export const AddPropertySchema = Yup.object({
  structure: Yup.number()
    .typeError("Structure is required")
    .required("Structure is required")
    .moreThan(0, "Structure is required"),
  name: Yup.string().required("Property Type Name is required"),
  internal_property_type_id: Yup.string().nullable(),
  property_size_sqm: Yup.number()
    .typeError("Must be a number")
    .required("Property size is required"),
  max_guests: Yup.number()
    .typeError("Must be a number")
    .required("Max number of guests is required")
    .min(1),
  num_beds: Yup.number().required().min(0),
  num_sofa_beds: Yup.number().required().min(0),
  num_bedrooms: Yup.number().required().min(0),
  num_bathrooms: Yup.number().required().min(0),
  amenities: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      }),
    )
    .min(1, "Please select at least one amenity")
    .required("Amenities are required"),
  beds: Yup.array()
    .of(
      Yup.object().shape({
        bed_type: Yup.string()
          .oneOf(["Single", "Double", "Queen", "King"])
          .required(),
        quantity: Yup.number().required().min(1),
      }),
    )
    .min(1),
  image_url: Yup.string().url(),

});
