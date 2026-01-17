import { AxiosError } from 'axios';
import { toast } from 'sonner';

export type APIError = AxiosError<{
  message?: string | string[];
  detail?: string;
  [key: string]: unknown;
}>;

export default function useShowAPIErrorMessage() {
  return (error: unknown) => {
    if (!error || typeof error !== 'object' || error === null) {
      toast.error('An unexpected error occurred');
      return;
    }

    // Type guard for AxiosError
    const maybeAxiosError = error as Partial<
      AxiosError<{
        message?: string | string[];
        detail?: string;
        [key: string]: unknown;
      }>
    >;
    if (!maybeAxiosError.response || !maybeAxiosError.response.data) {
      toast.error('An unexpected error occurred');
      return;
    }

    const data = maybeAxiosError.response.data;
    let message: string = 'An unexpected error occurred';

    if (typeof data.detail === 'string') {
      message = data.detail;
    } else if (typeof data.message === 'string') {
      message = data.message;
    } else if (Array.isArray(data.message)) {
      message = data.message.join(', ');
    } else if (typeof data === 'object' && data !== null) {
      const firstKey = Object.keys(data)[0];
      const value = (data as Record<string, unknown>)[firstKey];
      if (Array.isArray(value)) {
        message = String(value[0]);
      } else if (typeof value === 'string') {
        message = value;
      }
    }

    toast.error(message);
  };
}
