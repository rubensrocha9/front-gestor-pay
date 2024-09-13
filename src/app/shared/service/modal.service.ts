import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private notification: NzNotificationService
  ) { }

  modalLoadDataError(errorObj?: any, onOk?: () => any): void {
    const content = `Erro ao confirmar dados. Tenta de novo. Se o erro persistir,Entre em contato com o administrador do sistema.`
    const message = errorObj.error.message ?? errorObj.message;

    if (message) {
			this.notification.warning(
				'Atenção!',
        message
			);
		} else {
			this.notification.error(
				'Ops! Ocorreu um erro',
				content
			);
		}
  }
}
