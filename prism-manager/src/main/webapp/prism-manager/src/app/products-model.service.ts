import { Injectable } from '@angular/core';

@Injectable()
export class ProductsModelService {
  dataModel = {
    prods: [
        {
          // icon: "",
          label: "ALM 12.55",
          value: "alm1255",
          apps: [
            {
              label: 'a_app1',
              envs: [
                {
                  label: 'env1'
                },
                {
                  label: 'env2'
                }
              ]
            },
            {
              label: 'a_app2',
              envs: [
                {
                  label: 'env3'
                },
                {
                  label: 'env4'
                }
              ]
            },
          ]
        },
        {
          // icon: "",
          label: "Octane",
          value: "octane",
          apps: [
            {
              label: 'o_app1',
              envs: [
                {
                  label: 'env5'
                },
                {
                  label: 'env6'
                }
              ]
            },
            {
              label: 'o_app2',
              envs: [
                {
                  label: 'env7'
                },
                {
                  label: 'env8'
                }
              ]
            },
          ]
        }
      ]
  };

  constructor() {
  }

  getProds() {
    return this.dataModel.prods;
  }

  getProdApps(prod) {
    return prod.apps;
  }

  getAppEnvs(app) {
    return app.envs;
  }

  addProdApp(prod, app){
    if (app)
      this.getProdApps(prod).push({ label:app, envs: [] });
  }

  removeProdApp(prod, app){
    let array = this.getProdApps(prod);
    let index = array.indexOf(app);
    array.splice(index, 1);
  }

  addAppEnv(app, env){
    if (env)
      this.getAppEnvs(app).push({ label:env })
  }

  removeAppEnv(app, env){
    let array = this.getAppEnvs(app);
    let index = array.indexOf(env);
    array.splice(index, 1);
  }
}
