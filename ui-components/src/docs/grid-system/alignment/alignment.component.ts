import {Component, OnInit} from "@angular/core";
import {GridModelService} from "../grid-model.service";

@Component({
  selector: 'prism-alignment',
  templateUrl: './alignment.component.html',
  styleUrls: ['./alignment.component.less']
})
export class AlignmentComponent implements OnInit {

  grid: any;

  constructor(private data: GridModelService) {
    this.grid = data.gridDataModel();
  }

  ngOnInit() {
  }

}
