interface UseFormStatusProps {
  isSubmitting?: boolean;
  isLoading?: boolean;
  externalLoading?: boolean; 
}

export function useFormStatus({
  isSubmitting,
  isLoading,
  externalLoading,
}: UseFormStatusProps) {
  const isFormDisabled = !!(isSubmitting || isLoading || externalLoading);
  return { isFormDisabled };
}
