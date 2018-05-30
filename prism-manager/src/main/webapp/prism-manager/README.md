# PrismManager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.4.

## Build, run and watch the application with server side available
Run the Manager server jar with 'webpack' profile active:

`java -jar com.hpe.prism.Manager -Dspring.profiles.active="webpack"` 

Navigate to `https://devenv.hpeswlab.net:8443/`.
The project will be rebuilt automatically on any code change.
The build artifacts will be stored in the `resources/static` directory.

##### Build, run and watch the application using IntelliJ IDE:
In Run/Debug Configuration window, add Spring Boot app, pick com.hpe.prism.Manager as the main class, and add 'webpack' in the Active Profile field.
Then click the Run or the Debug button to build and run the application.

For updating resources on server automatically:
1. Go to File->Settings, then to "Build,Execution,Deployment"->Compiler and enable the "Make project automatically" flag. 
2. Press Ctrl-Alt-Shift-/ and select "Registry" from the menu that appears. Enable compiler.automake.allow.when.app.running flag.
3. Start/restart the app and observe static content reloading.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Note that this is for running the client app only.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `resources/static` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
