import { Injectable } from '@angular/core';
import {MessagingService} from "../messaging/messaging.service";

@Injectable()
export class RecordingStateService {

  private _recordingName: string;
  private _clicksCount: number = 0;
  private _played: boolean = false;
  private _recordingNames: Array<string> = ['session1', 'session2', 'session3'];

  constructor(public messagingService: MessagingService) { }

  get recordingName(): string {
    return this._recordingName;
  }

  set recordingName(name: string) {
    this._recordingName = name;
  }

  get clicksCount(): number {
    return this._clicksCount;
  }

  set clicksCount(count: number) {
    this._clicksCount = count;
  }

  get played(): boolean {
    return this._played;
  }

  set played(isPlay: boolean) {
    this._played = isPlay;
  }

  get recordingNames() {
   /*  this.messagingService.sendMessageToExt({message: 'getRecordingNames'}, function (response) {
      console.log("response=" + response);
      this._recordingNames = response;
    }.bind(this));*/
    return this._recordingNames;
  }

  set recordingNames(recordingNames: Array<string>) {
    this._recordingNames = recordingNames;
  }

 /* clicksCount(): number {
    this.messagingService.sendMessageToExt({message: 'clicksCount'}, function (response) {
      console.log("response=" + response);
      this._currentRecording.clicksCount = response;
    }.bind(this));
  }*/

  startRecording() {
    this.played = true;
    this.messagingService.sendMessageToExt(
      {message: 'startRecording', recordingName: this.recordingName},
      function(response) {
        console.log('set recording icon');
       });
  }

  /*pauseRecording() {
      this..played = false;
  }*/

  stopRecording() {
    // clear current recording
    this.recordingName = '';
    this.played = false;
    this.clicksCount = 0;
    this.messagingService.sendMessageToExt(
      {message: 'stopRecording', recordingName: this.recordingName},
      function(response) {
        console.log('set to default icon');
      });
  }

  revertClicks(clicksNumber) {
    console.log(clicksNumber)
  }
}
