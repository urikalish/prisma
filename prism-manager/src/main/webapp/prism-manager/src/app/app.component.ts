import { Component } from '@angular/core';
import { ProductsModelService } from "./products-model.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Prism';
  selectedProduct;
  addingApplication: boolean = false;
  addingApplicationToProduct: string;
  addingApplicationName: string;
  addingEnvironmentToApplication: string;
  addingEnvironmentName: string;


  constructor(private productsModelService: ProductsModelService) {
    let products = productsModelService.getProds();
    if (products.length > 0)
    {
      this.selectedProduct = products[0];
    }
  }


  selectProd(prod): void {
    this.selectedProduct = prod;
  }

  addFirstApplicationClicked(){
    this.addingApplication = true;
    this.addingApplicationToProduct = this.selectedProduct.label;
  }

  addApplicationClicked(){
    this.addingApplication = true;
    this.addingApplicationToProduct = this.selectedProduct.label;
  }

  submitApplication(){
    this.productsModelService.addProdApp(this.selectedProduct, this.addingApplicationName);
    this.addingApplication = false;
    this.addingApplicationToProduct = null;
    this.addingApplicationName = null;
  }

  cancelAddApplication(){
    this.addingApplication = false;
    this.addingApplicationToProduct = null;
    this.addingEnvironmentName = null;
  }

  removeProdApp(prod, app){
    this.productsModelService.removeProdApp(this.selectedProduct, app);
  }



  addEnvironmentClicked(app){
    this.addingEnvironmentToApplication = app.label;
  }

  submitEnvironment(app){
    this.productsModelService.addAppEnv(app, this.addingEnvironmentName);
    this.addingEnvironmentToApplication = null;
    this.addingEnvironmentName = null;
  }

  cancelAddEnvironment(){
    this.addingEnvironmentToApplication = null;
    this.addingEnvironmentName = null;
  }

  removeAppEnv(app, env){
    this.productsModelService.removeAppEnv(app, env);
  }
}
