import { Injectable } from '@angular/core';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  showSuccess(message: any, title: string) {
    Notify.success(`${message}` ?? `${title}`, {
      width: '500px',
      pauseOnHover: true,
      position: 'center-top',
      showOnlyTheLastOne: true,
      timeout: 5000,
    });
  }

  showError(message: any, title: string) {
    Notify.failure(`${message}` ?? `${title}`, {
      width: '500px',
      pauseOnHover: true,
      position: 'center-top',
      showOnlyTheLastOne: true,
      timeout: 5000,
    });
  }

  showInfo(message: any, title: string) {
    Notify.info(`${message}` ?? `${title}`, {
      width: '500px',
      pauseOnHover: true,
      position: 'center-top',
      showOnlyTheLastOne: true,
      timeout: 5000,
    });
  }

  showWarning(message: any, title: string) {
    Notify.warning(`${message}` ?? `${title}`, {
      width: '500px',
      pauseOnHover: true,
      position: 'center-top',
      showOnlyTheLastOne: true,
      timeout: 5000,
    });
  }
}
