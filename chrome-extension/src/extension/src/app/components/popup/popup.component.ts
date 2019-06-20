import {Component, Inject, NgZone, OnInit} from "@angular/core";
import {BackgroundService} from "../../services/background/background.service";
import {Filter, SelectedFilter} from "../../services/state/state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.less'],
})
export class PopupComponent implements OnInit {

  // TODO: move state change to BG
  constructor(@Inject('bgService') public backgroundService: BackgroundService,
              private router: Router,
              private zone: NgZone) {
  }

  async ngOnInit() {
    this.backgroundService.runs$.subscribe(this.hasRunsNavigation.bind(this));
  }

  async hasRunsNavigation(hasRuns: boolean) {
    this.zone.run(() => {
      if (hasRuns) {
        if(this.router.url === '/popup') {
          return;
        }
        this.router.navigate(['/popup'])
          .then( () => {
            this.backgroundService.setMonitoringIconForAllAUTTabs().then();
            this.backgroundService.filterEvents().then();
          });
      }
      else {
        const text = "There are no runs with PRiSMA coverage for the current selection";
        this.router.navigate(['/alert', "WARNING", text, true])
          .then( () => {
            this.backgroundService.setNotMonitoringIconForAllAUTTabs().then();
          });
      }
    });
  }

  public get state() {
    return this.backgroundService.state;
  }

  public get presetIndex() {
    return this.state.get('selectedPresetIndex');
  }

  convertUIFilterToSelected(uiFilter: SelectedUIFilter): SelectedFilter {
    return {
      ...uiFilter.field,
      values: uiFilter.value
    }
  }

  convertSelectedFilterToUI(filter: SelectedFilter): SelectedUIFilter {
    return {
      field: {
        label: filter.label,
        logicalName: filter.logicalName,
        type: filter.type
      },
      value: filter.values
    }
  }

  getEnvironmentFilters(envIndex: number) {
    return this.backgroundService.getEnvironmentFilters(this.presetIndex, envIndex)
      .map((filter) => this.convertSelectedFilterToUI(filter))
  }

  toggleEnvSelected(value: boolean, environmentIndex: number) {
    if (isNaN(environmentIndex)) {
      return;
    }

    const presetIndex = this.presetIndex;
    const state = this.state.get('presets', presetIndex, 'environments', environmentIndex, 'isSelected');

    if (state !== value) {
      this.state.set(!state, 'presets', presetIndex, 'environments', environmentIndex, 'isSelected');
    }
  }

  toggleEnvCovered(environmentIndex: number) {
    this.backgroundService.toggleEnvCovered(environmentIndex);
  }

  onFieldSelected(filter) {
    this.backgroundService.selectedFilter = filter;
  }

  onFiltersChanged(uiFilters: Array<SelectedUIFilter>, environmentIndex: number) {
    if (isNaN(environmentIndex)) {
      return;
    }

    const presetIndex = this.presetIndex;
    const filters = uiFilters.map(filter => this.convertUIFilterToSelected(filter));

    this.backgroundService.setEnvironmentFilters(presetIndex, environmentIndex, filters);

    this.backgroundService.filterEvents();
  }

  onPresetSelected(index: any) {
    if (isNaN(index)) {
      return;
    }

    this.backgroundService.selectPresetByIndex(index);
    this.backgroundService.filterEvents();
  }
}

export interface SelectedUIFilter {
  field: Filter,
  value: Array<any> | any
}
