import {Component, Inject} from "@angular/core";
import {BackgroundService} from "../../services/background/background.service";

@Component({
  selector: 'recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.less']
})
export class RecordingComponent {
  public backgroundService: BackgroundService;
  public currentQuery: string = '';

  get state() {
    return this.backgroundService.state;
  }

  queryChanged(query: string) {
    this.currentQuery = query;
    this.backgroundService.setCurrentRecordingTags(null);
  }

  constructor(@Inject('bgService') backgroundService: BackgroundService) {
    this.backgroundService = backgroundService;
  }
}
