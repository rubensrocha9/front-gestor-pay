import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  static validateForm(formGroup: FormGroup): boolean {
		Object.keys(formGroup.controls).forEach((key: string) => {
			const abstractControl = formGroup.get(key);

			if (abstractControl instanceof FormGroup) {
				this.validateForm(abstractControl);
			} else {
				formGroup.controls[key].markAsDirty();
				formGroup.controls[key].updateValueAndValidity();
			}
		});

		return formGroup.valid;
	}
}
