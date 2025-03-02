import { Alert, Snackbar } from "@mui/material";

interface ErrorSnackbarProps {
    error: any;
    open: boolean;
    onClose: () => void;
  }
  
  const ErrorSnackbar = ({ error, open, onClose }: ErrorSnackbarProps) => {
    const getErrorMessage = () => {
      if (!error?.response) {
        return 'An unexpected error occurred.';
      }
  
      switch (error.response?.status) {
        case 400:
          return 'Error: Invalid details, try again.';
        case 401:
          return 'Error: Unauthorized access.';
        case 403:
          return 'Error: Forbidden access.';
        case 500:
          return 'Server error, try again later.';
        default:
          return 'An unexpected error occurred.';
      }
    };
  
    return (
      <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
        <Alert severity="error" variant="filled" sx={{ width: '100%' }} onClose={onClose}>
          {getErrorMessage()}
        </Alert>
      </Snackbar>
    );
  };
  
  export default ErrorSnackbar;
  