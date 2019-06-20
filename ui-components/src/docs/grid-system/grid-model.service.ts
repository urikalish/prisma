import {Injectable} from "@angular/core";

@Injectable()
export class GridModelService {
  grid = {
    sizes: [1, 2, 3, 4, 5, 6, 7, 8],
    alignment: ['stretch', 'start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'],
    selected: {
      content: 'default',
      horizontal: 'default',
      vertical: 'default'
    }
  };

  constructor() {
  }

  gridDataModel(): any {
    return this.grid;
  }
}
