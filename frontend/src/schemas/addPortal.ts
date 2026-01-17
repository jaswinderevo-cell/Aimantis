import * as Yup from 'yup';
export const addPortalSchema = Yup.object().shape({
  portalName: Yup.string().required('Portal name is required'),
});
