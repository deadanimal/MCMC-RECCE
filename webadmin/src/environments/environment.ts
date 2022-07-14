// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: 'https://mcmc-database-api.pipe.my/',
  // baseUrl: 'http://127.0.0.1:8000/',
  baseUrl: 'http://192.168.11.136/',
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYWZlZXpheml6IiwiYSI6ImNqNjJ6anlhYzA0bTczM3FvYnppbDh4eTEifQ.AdDRr42bNfNJvQENLrE6eg' // Your access token goes here
  },
  reCaptchaSiteKey: "6LcmW2UaAAAAAN8l9okEsS0f3QZbyn0ch52Y1qg1",
  reCaptchaSecretKey: "6LcmW2UaAAAAAHGM0xB2TYAXd6nloMYH2h01LVIM",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
