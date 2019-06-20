import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'boldQuery'
})
export class BoldQueryPipe implements PipeTransform {

  transform(text: string, query: string): Array<string> {
    let index = text.toLowerCase().indexOf(query.toLowerCase());

    return [text.slice(0, index), text.slice(index, index + query.length), text.slice(index + query.length)];
  }

}
