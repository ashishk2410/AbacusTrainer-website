// User-friendly error message translations
// Hides technical Firebase error details from users

export function getFriendlyErrorMessage(error: any): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  const errorCode = error.code || '';
  const errorMessage = error.message || '';

  // Firebase Auth Errors
  if (errorCode.includes('auth/invalid-credential') || errorCode.includes('auth/wrong-password') || errorCode.includes('auth/user-not-found')) {
    return 'The email or password you entered is incorrect. Please check your credentials and try again.';
  }

  if (errorCode.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }

  if (errorCode.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact support for assistance.';
  }

  if (errorCode.includes('auth/too-many-requests')) {
    return 'Too many login attempts. Please wait a few minutes and try again.';
  }

  if (errorCode.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  if (errorCode.includes('auth/invalid-api-key')) {
    return 'Configuration error. Please contact support.';
  }

  if (errorCode.includes('auth/operation-not-allowed')) {
    return 'This login method is not enabled. Please contact support.';
  }

  // Firestore Errors
  if (errorCode.includes('permission-denied')) {
    return 'You do not have permission to perform this action.';
  }

  if (errorCode.includes('unavailable')) {
    return 'Service temporarily unavailable. Please try again in a moment.';
  }

  if (errorCode.includes('not-found')) {
    return 'The requested information could not be found.';
  }

  // Check for missing environment variables or configuration errors
  if (errorCode === 'auth/configuration-error' || 
      errorMessage.includes('Firebase environment variables are not configured') || 
      errorMessage.includes('environment variables') ||
      errorMessage.includes('not properly initialized')) {
    return 'Firebase is not configured. Please contact support to set up the environment variables.';
  }

  // Generic fallback - remove technical details
  if (errorMessage.includes('Firebase') || errorMessage.includes('auth/') || errorMessage.includes('firestore/')) {
    return 'Unable to complete this action. Please try again or contact support if the problem persists.';
  }

  // If it's already a user-friendly message, return it
  if (errorMessage && !errorMessage.includes('Firebase') && !errorMessage.includes('auth/') && !errorMessage.includes('firestore/')) {
    return errorMessage;
  }

  return 'An unexpected error occurred. Please try again.';
}


