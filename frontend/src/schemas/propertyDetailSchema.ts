import * as Yup from 'yup';

export const PropertyDetailSchema = Yup.object({
  name: Yup.string().required('Property name is required'),

  property_type: Yup.number().typeError("Property type is required").required('Property type is required'),

  floor_number: Yup.number()
    .typeError('Floor must be a number')
    .required('Floor number is required')
    .min(0, 'Floor cannot be negative'),

  internal_property_id: Yup.string().optional(),

  amenities: Yup.array()
    .of(
      Yup.object({
        label: Yup.string().required(),
        value: Yup.string().required(),
      }),
    )
    .min(1, 'Select at least one amenity')
    .required('Amenity is required'),
});
