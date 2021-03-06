import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {PrismButtonComponent} from "./components/prism-button/prism-button.component";
import {PrismInputComponent} from "./components/prism-input/prism-input.component";
import {PrismCheckboxComponent} from "./components/prism-checkbox/prism-checkbox.component";
import {PrismListItemComponent} from "./components/prism-dropdown-components/prism-list-item/prism-list-item.component";
import {PrismListComponent} from "./components/prism-dropdown-components/prism-list/prism-list.component";
import {PrismDropdownComponent} from "./components/prism-dropdown-components/prism-dropdown/prism-dropdown.component";
import {PrismToggleDirective} from "./directives/prism-toggle-directive/prism-toggle.directive";
import {PrismColorPickerComponent} from "./components/prism-color-picker/prism-color-picker.component";
import {PrismFilterableListComponent} from "./components/prism-filterable-list/prism-filterable-list.component";
import {FilterPipe} from "./pipes/filter.pipe";
import {PrismFilterComponent} from "./components/prism-filter/prism-filter.component";
import {TabbableInputDirective} from "./directives/prism-tabbable-input/tabbable-input.directive";
import {ListNavigationDirective} from "./directives/prism-list-navigation/list-navigation.directive";
// import {PrismTimerComponent} from "./components/prism-timer/prism-timer.component";
import {ItemDisplayNamePipe} from "./components/prism-filterable-list/item-display-name.pipe";
import {BoldQueryPipe} from "./components/prism-filterable-list/bold-query.pipe";
import {ClickOutsideDirective} from "./directives/click-outside/click-outside.directive";

@NgModule({
  declarations: [
    PrismButtonComponent,
    PrismInputComponent,
    PrismCheckboxComponent,
    PrismListItemComponent,
    PrismListComponent,
    PrismDropdownComponent,
    PrismToggleDirective,
    PrismColorPickerComponent,
    PrismFilterableListComponent,
    FilterPipe,
    PrismFilterComponent,
    TabbableInputDirective,
    ListNavigationDirective,
    // PrismTimerComponent,
    ItemDisplayNamePipe,
    BoldQueryPipe,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  exports: [
    PrismButtonComponent, PrismInputComponent,
    PrismListItemComponent, PrismListComponent,
    PrismDropdownComponent, PrismToggleDirective,
    PrismCheckboxComponent, PrismColorPickerComponent,
    FilterPipe, PrismFilterableListComponent,
    PrismFilterComponent, ListNavigationDirective,
    // PrismTimerComponent
  ],
  providers: [ItemDisplayNamePipe]
})
export class UIComponentsModule {
}
