import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Application} from "./application";

@Component({
  selector: 'application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {

  applications: Application[];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get<Application[]>('/rest/applications'
    ).subscribe(data => {
      this.applications = data;
    });
  }

  addApplication(appName: string, tenantId: string) {
    this.http.post('/rest/applications', {appName: appName, tenantId: tenantId}).subscribe();
  }

}
