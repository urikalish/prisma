import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class WhiteListService {

  private readonly blackListSubject: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set());
  private readonly blackList$: Observable<Set<string>> = this.blackListSubject.asObservable();

  public set blackList(list: Array<string>) {
    this.blackListSubject.next(new Set<string>(list));
  }

  constructor() {
  }

  public isAllowed(item: string): boolean {
    const list = this.blackListSubject.getValue();
    let ret = true;

    if (list.has(item)) {
      ret = false;
    } else {
      for (let listItem of list) {
        console.log(item, listItem);
        if (listItem.endsWith('*') && item.startsWith(listItem.replace('*', ''))) {
          ret = false;
          break;
        }
      }
    }

    return ret;
  }
}
