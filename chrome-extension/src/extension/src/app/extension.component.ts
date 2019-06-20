import {Component} from "@angular/core";
import {NavigationEnd, NavigationStart, Router, RouterEvent} from "@angular/router";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'extension',
  templateUrl: 'extension.component.html',
  styleUrls: ['./extension.component.less'],
})
export class ExtensionComponent {
  private loadingSubject = new BehaviorSubject<boolean>(true);

  public get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  };

  constructor(private router: Router) {
    this.router.events.subscribe(this.navigationInterceptor.bind(this));
  }

  navigationInterceptor(event: RouterEvent) {
    if (event instanceof NavigationStart) {
      this.loadingSubject.next(true);
    }
    if (event instanceof NavigationEnd) {
      this.loadingSubject.next(false);
    }
  }
}
