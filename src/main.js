import environment from './environment';
import authConfig from './config/auth';
import * as entiteti from './config/entities';
import { AuthService } from 'aurelia-authentication';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N, TCustomAttribute } from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend'; 
import { AltairCommon } from 'helper/altair_admin_common';


export function configure(aurelia) {
  let ea = aurelia.container.get(EventAggregator);
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-api',
      config => {
        config
          .registerEndpoint('auth',
            configure => {
              configure.withBaseUrl('/');
            })
          .registerEndpoint('lokal',
            configure => {
              configure.withBaseUrl('api/');
              configure.withDefaults({
                //credentials: 'same-origin',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': "application/json",
                  'X-Requested-With': 'Fetch'
                }
              })
              configure.withInterceptor({
                request(request) {
                  let ac = aurelia.container.get(AltairCommon);
                  //toastr.success(`Requesting ${request.method} ${request.url}`);
                  ac.altair_helpers.content_preloader_show('md');
                  return request;
                  // you can return a modified Request, or you can short-circuit the request by returning a Response
                },
                response(response) {
                  let ac = aurelia.container.get(AltairCommon);
                  
                  ac.altair_helpers.content_preloader_hide();
                  //toastr.success(`Received ${response.status} ${response.url}`);
                  return response; // you can return a modified Response
                  //return response.json().then(Promise.reject.bind(Promise));

                }
              });
          })
          .registerEndpoint('fajl',
            configure => {
              configure.withBaseUrl('api/');
              configure.withDefaults({
                //credentials: 'same-origin',
                headers: {
                  'Accept': 'application/json',
                  'X-Requested-With': 'Fetch'
                }
              })
              configure.withInterceptor({
                request(request) {
                  let ac = aurelia.container.get(AltairCommon);
                  //toastr.success(`Requesting ${request.method} ${request.url}`);
                  ac.altair_helpers.content_preloader_show('md');
                  return request;
                  // you can return a modified Request, or you can short-circuit the request by returning a Response
                },
                response(response) {
                  let ac = aurelia.container.get(AltairCommon);

                  ac.altair_helpers.content_preloader_hide();
                  //toastr.success(`Received ${response.status} ${response.url}`);
                  return response; // you can return a modified Response
                  //return response.json().then(Promise.reject.bind(Promise));

                }
              });
            })
          .setDefaultEndpoint('lokal')
      })
    .plugin('aurelia-orm',
      builder => {
        builder.registerEntities(entiteti.KorisnikEntity, entiteti.KlijentEntity, entiteti.KontaktEntity,
          entiteti.PrimarnaEntity, entiteti.SekundarnaEntity, entiteti.TercijarnaEntity, entiteti.ObimEntity
          );
      })
    //.plugin('aurelia-mousetrap', config => {
    //  // Example keymap
    //  config.set('keymap', {
    //    "alt+n": "KS_SEARCH",
    //    "n": "KS_NEW"
    //  });
    //})
    //.plugin('aurelia-kendoui-bridge')
    .plugin('aurelia-kendoui-bridge', kendo => {
      kendo.kendoGrid()
        .kendoTemplateSupport()
        .kendoComboBox()
        //.kendoBarcode()
        .kendoContextMenu()
        .kendoDatePicker()
        .kendoNumericTextBox()
        .kendoDateTimePicker()
        .kendoAutoComplete()
        .kendoDropDownList()
        .kendoTabStrip()
        .kendoMultiSelect()
    })
    .plugin('aurelia-validation')
    .plugin('aurelia-after-attached-plugin')
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
      config.settings.startingZIndex = 5;
      config.settings.keyboard = true;
    })
    .plugin('aurelia-authentication',
        baseConfig => {
          baseConfig.configure(authConfig);
        })
    .plugin('aurelia-i18n', (instance) => {
      let aliases = ['t', 'i18n'];
      // add aliases for 't' attribute
      TCustomAttribute.configureAliases(aliases);

      // register backend plugin
      instance.i18next.use(Backend);

      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading
      return instance.setup({
        backend: {                                  // <-- configure backend settings
          loadPath: './locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
        },
        attributes: aliases,
        lng: 'sr',
        fallbackLng: 'en',
        debug: true
      });
  });
  //$(':input').keypress(function(e){
  //  if(e.which == 13){
  //    ti = $(this).attr('tabindex') + 1;
  //    $('input[tabindex='+ti+']').focus();
  //    //try to use________ e.which = 9; return e.which;
  //  }else if(e.which == 9){
  //    e.preventDefault(); //or return false;
  //  }
  //});


  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  //aurelia.start().then(() => aurelia.setRoot());
  aurelia.start().then(a => {

    // moment().locale('sr');
    // console.log(moment().format());
    //localStorage.setItem("putanja", window.location.href);
    let authService = aurelia.container.get(AuthService);
    //console.log(authService);
    //let payload = authService.getTokenPayload();
    let auth = authService.isAuthenticated();
    //console.log( 'a: ' + auth);
    if (auth === true) {
      authService.updateToken()
        .then(result => {
          if (result === true) {
            a.setRoot('app', document.body);
          } else {
            a.setRoot('pages/login/login');
          }
        })
        .catch(err => {
          console.log(err);
          //console.log('login');
          a.setRoot('pages/login/login');
        });
    } else {

      a.setRoot('pages/login/login');
    }

    //let rootComponent = authService.authenticated ? 'app' : 'login';
    //a.setRoot(rootComponent);

  });
}
