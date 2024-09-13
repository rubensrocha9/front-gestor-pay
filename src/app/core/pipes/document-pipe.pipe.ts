import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'document',
  standalone: true
})
export class DocumentPipePipe implements PipeTransform {

  transform(value: string | number): unknown {
    if (!value) return '';

    let cpfCnpj = value.toString().replace(/\D/g, '');

    if (cpfCnpj.length === 11) {
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cpfCnpj.length === 14) {
      return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
      return value.toString();
    }
  }

}
