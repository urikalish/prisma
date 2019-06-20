import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'prism-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.less']
})
export class InputsComponent implements OnInit {

  dataModel = {text1: "", text2: ""};


  constructor() {
  }

  ngOnInit() {
  }

}
