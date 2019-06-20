import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule, Routes} from "@angular/router";
import {GridSystemComponent} from "./grid-system/grid-system.component";
import {ContainerComponent} from "./grid-system/container/container.component";
import {RowComponent} from "./grid-system/row/row.component";
import {ItemComponent} from "./grid-system/item/item.component";
import {GridModelService} from "./grid-system/grid-model.service";
import {AlignmentComponent} from "./grid-system/alignment/alignment.component";
import {ComplexStructuresComponent} from "./grid-system/complex-structures/complex-structures.component";
import {ComponentsComponent} from "./components/components.component";
import {ButtonsComponent} from "./components/buttons/buttons.component";
import {CheckboxesComponent} from "./components/checkboxes/checkboxes.component";
import {DropdownsComponent} from "./components/dropdowns/dropdowns.component";
import {InputsComponent} from "./components/inputs/inputs.component";
import {FiltersComponent} from "./components/filters/filters.component";
import {DocsComponent} from "./docs.component";
import {UIComponentsModule} from "./../lib/ui-components.module";

const appRoutes: Routes = [
  {
    path: 'css',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'containers'
      },
      {
        path: 'containers',
        component: ContainerComponent
      },
      {
        path: 'rows',
        component: RowComponent
      },
      {
        path: 'items',
        component: ItemComponent
      },
      {
        path: 'complex',
        component: ComplexStructuresComponent
      },
    ]
  },
  {
    path: 'components',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'buttons'
      },
      {path: 'buttons', component: ButtonsComponent},
      {path: 'checkboxes', component: CheckboxesComponent},
      {path: 'dropdowns', component: DropdownsComponent},
      {path: 'inputs', component: InputsComponent},
      {path: 'filters', component: FiltersComponent},
    ]
  },
  {path: '**', redirectTo: 'css'}
];

@NgModule({
  imports: [
    CommonModule,
    UIComponentsModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    GridSystemComponent,
    ContainerComponent,
    RowComponent,
    ItemComponent,
    AlignmentComponent,
    ComplexStructuresComponent,
    ComponentsComponent,
    ButtonsComponent,
    CheckboxesComponent,
    DropdownsComponent,
    InputsComponent,
    FiltersComponent,
    DocsComponent
  ],
  exports: [],
  providers: [GridModelService],
  bootstrap: [DocsComponent]
})
export class DocsModule {
}
