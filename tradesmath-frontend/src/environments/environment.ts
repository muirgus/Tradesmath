// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    firebaseConfig: {
        apiKey: 'AIzaSyDcwvJOWWj2ly-OfU3EeLZ-QQUWzRCwFMM',
        authDomain: 'welders-math.firebaseapp.com',
        databaseURL: 'https://welders-math-default-rtdb.firebaseio.com',
        projectId: 'welders-math',
        storageBucket: 'welders-math.appspot.com',
        messagingSenderId: '912159839557',
        appId: '1:912159839557:web:9fa85c35cf2072c0511a2c',
        measurementId: 'G-6D9R52VXEK',
    },
    // apiEndpoint: 'http://localhost:5000',
    apiEndpoint: 'https://demoapi.mycodelibraries.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
