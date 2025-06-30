export interface AppError {
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
}

export class ErrorHandler {
  static createError(message: string, code?: string, details?: any): AppError {
    return {
      message,
      code,
      details,
      timestamp: new Date()
    };
  }

  static isNetworkError(error: any): boolean {
    return error.name === 'TypeError' && error.message.includes('fetch');
  }

  static isApiError(error: any): boolean {
    return error.status >= 400 && error.status < 600;
  }

  static getErrorMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return 'Network error. Please check your internet connection.';
    }
    
    if (this.isApiError(error)) {
      return error.message || `API Error: ${error.status}`;
    }
    
    return error.message || 'An unexpected error occurred';
  }

  static logError(error: AppError, context?: string): void {
    console.error(`[${context || 'App'}] Error:`, {
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      details: error.details
    });
  }
} 