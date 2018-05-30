import {Component, OnInit} from "@angular/core";
import {GridModelService} from "../grid-model.service";

@Component({
  selector: 'prism-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.less']
})
export class ItemComponent implements OnInit {

  grid: object;

  constructor(private data: GridModelService) {
    this.grid = data.gridDataModel();
  }

  ngOnInit() {
  }

}
