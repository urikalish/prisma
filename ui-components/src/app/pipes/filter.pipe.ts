import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any, key: string, term: string) {
    return items.filter(item => {
      if(!!key && !!term && item.hasOwnProperty(key)) {
        return item[key].toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1;
      } else if(!!term){
        return item.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1;
      } else {
        return true;
      }
    });
  }
}
