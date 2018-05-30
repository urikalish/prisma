import { Component, OnInit } from '@angular/core';
import {RecordingStateService} from "../../services/recording-state/recording-state.service";

@Component({
  selector: 'recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.less']
})
export class RecordingComponent implements OnInit {

  constructor(public recordingState: RecordingStateService) { }

  ngOnInit() {
  }

}
