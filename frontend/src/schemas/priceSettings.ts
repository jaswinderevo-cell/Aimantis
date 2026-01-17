import * as Yup from 'yup';

export const PriceSettingsSchema = Yup.object().shape({
  booking: Yup.number()
    .required('This field is required')
    .typeError('Please enter a valid number')
    .positive('It must be a positive number'),
  airbnb: Yup.number()
    .required('This field is required')
    .typeError('Please enter a valid number')
    .positive('It must be a positive number'),
  expedia: Yup.number()
    .required('This field is required')
    .typeError('Please enter a valid number')
    .positive('It must be a positive number'),
});
