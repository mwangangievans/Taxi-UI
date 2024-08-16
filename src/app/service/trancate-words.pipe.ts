import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trancateWords',
  standalone: true,
})
export class TrancateWordsPipe implements PipeTransform {
  transform(value: string, limit: number = 30): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
