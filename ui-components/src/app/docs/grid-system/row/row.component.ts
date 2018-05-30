import {Component, OnInit} from "@angular/core";
import {GridModelService} from "../grid-model.service";

@Component({
  selector: 'prism-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.less']
})
export class RowComponent implements OnInit {

  grid: object;

  constructor(private data: GridModelService) {
    this.grid = data.gridDataModel();
  }

  ngOnInit() {
  }

}
