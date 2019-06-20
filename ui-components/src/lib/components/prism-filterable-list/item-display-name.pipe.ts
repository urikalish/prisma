import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'itemDisplayName'
})
export class ItemDisplayNamePipe implements PipeTransform {

  transform(item: any, key?: string): string {
    let ret = !!key ? item[key] : item;

    return !!ret ? ret : item;
  }
}
