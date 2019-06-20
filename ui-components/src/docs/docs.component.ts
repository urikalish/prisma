import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {isNullOrUndefined} from "util";

// Google Code Prettify
declare let PR;

@Component({
  selector: 'prism-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.less']
})
export class DocsComponent implements OnInit {
  public asideLinks = [
    {label: 'Layout'},
    // {label: 'Grid System', link: '/css'},
    {label: 'Containers', link: '/css/containers'},
    {label: 'Rows', link: '/css/rows'},
    {label: 'Items', link: '/css/items'},
    {label: 'Complex Structures', link: '/css/complex'},
    {label: 'Components'},
    {label: 'Buttons', link: '/components/buttons'},
    {label: 'Checkboxes', link: '/components/checkboxes'},
    {label: 'Dropdowns', link: '/components/dropdowns'},
    {label: 'Inputs', link: '/components/inputs'},
    {label: 'Filters', link: '/components/filters'},
  ];

  @ViewChild('scrollSection') scroll: ElementRef;

  constructor(private router: Router) {
  }

  ngOnInit() {
    // Run Google Code Prettify on every navigation to mark the code samples
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          //scroll to top
          this.scroll.nativeElement.scrollIntoView(true);

          // if prettify available, mark code
          if (!isNullOrUndefined(PR)) {
            PR.prettyPrint();
          }
        }
      });
  }
}
