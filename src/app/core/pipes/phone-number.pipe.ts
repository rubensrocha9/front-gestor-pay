import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneNumberPipe implements PipeTransform {

  transform(phoneNumber: string, countryCode: string = 'US'): unknown {
    if (!phoneNumber) return '';

    const cleaned = phoneNumber.replace(/\D/g, '');

    let formattedNumber = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    switch (countryCode.toUpperCase()) {
      case 'US':
        formattedNumber = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        break;
      case 'BR':
        formattedNumber = cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        break;
      default:
        formattedNumber = cleaned;
    }

    return formattedNumber;
  }

}
