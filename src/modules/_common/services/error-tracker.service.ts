import { usePublicApi } from './api.service';

interface ErrorLog {
  timestamp: string;
  type: string;
  message: string;
  stack: string;
  context?: any;
  url: string;
  userAgent: string;
}

export class ErrorTrackerService {
  static init(app: any) {
    // 개발 환경에서만 활성화
    if (!import.meta.env.DEV) return;

    // Vue 에러 캐치
    app.config.errorHandler = (err: any, instance: any, info: any) => {
      this.captureError(err, 'vue', {
        componentName: instance?.$options.name || 'Unknown Component',
        info
      });
    };

    // JavaScript 에러 캐치
    window.addEventListener('error', (event) => {
      this.captureError(event.error, 'javascript', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Promise rejection 캐치
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, 'promise', {
        promiseRejected: true
      });
    });
  }

  private static captureError(error: any, type: string, context?: any) {
    try {
      const errorLog: ErrorLog = {
        timestamp: new Date().toISOString(),
        type,
        message: error?.message || error?.toString() || 'Unknown error',
        stack: error?.stack || '',
        context,
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      // API로 에러 전송
      this.sendErrorToAPI(errorLog);
    } catch (e) {
      // 에러 트래킹 자체에서 에러가 발생해도 조용히 처리
      console.warn('Error tracking failed:', e);
    }
  }

  // 수동으로 에러 기록 (HTTP 에러 등에 사용)
  static captureManualError(error: any, type: string, context?: any) {
    this.captureError(error, type, context);
  }

  // API로 에러 전송
  private static async sendErrorToAPI(errorLog: ErrorLog) {
    try {
      await usePublicApi().post(import.meta.env.VITE_API + '/error-log', {
        type: errorLog.type,
        message: errorLog.message,
        stack: errorLog.stack,
        url: errorLog.url,
        userAgent: errorLog.userAgent,
        context: errorLog.context ? JSON.stringify(errorLog.context) : ''
      });
    } catch (error) {
      // API 전송 실패 시 조용히 처리 (에러 무한 루프 방지)
      console.warn('❌ Failed to send error to API:', error);
    }
  }
}
