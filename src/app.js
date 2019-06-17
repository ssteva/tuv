import { delayed } from 'aurelia-kendoui-bridge/common/decorators';
import { Aurelia, inject } from 'aurelia-framework';
import { AltairCommon } from 'helper/altair_admin_common';
import { AuthenticateStep, AuthService } from 'aurelia-authentication';
import { computedFrom } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';

//import {AuthenticateStepRole} from './helper/AuthenticateStepRole';
import { Promena } from './auth/promenaLozinke';
import routes from "./config/routes";
import { Endpoint } from 'aurelia-api';
import { RedirectToRoute } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { activationStrategy } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';
import toastr from 'toastr';
import 'kendo/js/kendo.dropdownlist';
import moment from 'moment';

@inject(AuthService)
class AuthenticateStepRole {
  determineActivationStrategy() {
    return activationStrategy.replace; //replace the viewmodel with a new instance
    // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
    // or activationStrategy.noChange to explicitly use the default behavior
  }
  constructor(authService) {
    this.authService = authService;
  }



  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.length > 0)) {

      let role = "";
      let payload = this.authService.getTokenPayload();
      if (payload) {
        role = payload.role;
      }
      if (navigationInstruction.config.auth && navigationInstruction.config.settings.roles.indexOf(role) === -1) {
        toastr.error(this.i18n.tr("Niste autorizovani za pristup"));
        return next.cancel();
      }
      return next();
      //if (!isAdmin) {
      //    return next.cancel(new RedirectToRoute('pages/login/login'));
      //}
    }
    return next();
  }
}

@inject(AltairCommon, AuthService, DialogService, Aurelia, Endpoint.of(), EventAggregator, I18N)
export class App {
  odabranijezik = "sr";
  prikazi;
  constructor(altairCommon, authService, dialogService, aur, lokalRepo, eventAggregator, i18N) {
    this.altairCommon = altairCommon;
    this.authService = authService;
    this.dialogService = dialogService;
    this.aur = aur;
    this.role = "";
    this.repo = lokalRepo;
    this.ea = eventAggregator;
    this.search = "";
    this.i18n = i18N;
    this.jezici = [{ id: "sr", naziv: "Srpski" }, { id: "en", naziv: "English" }];
    this.ea.subscribe('authentication-change', authenticated => {
      if (!authenticated) {
        //console.log(1);
        //this.router.navigateToRoute('login');
        this.aur.setRoot('pages/login/login');
      }
    });
    let payload = this.authService.getTokenPayload();
    if (payload) {
      if (Array.isArray(payload.unique_name))
        this.korisnik = payload.unique_name[0];
      else
        this.korisnik = payload.unique_name;
      this.role = payload.role;
      this.jezik = payload.Jezik;
      this.odabranijezik = this.jezik;
      this.ino = false;
      moment.locale(this.jezik);
      //this.ulogovan = `prijavljeni ste kao: ${payload.Ime} ${payload.Prezime} (${this.korisnik}), uloga: ${this.role}, email: ${payload.email}`;
      //if (localStorage["putanja"])
      //    window.location.href = localStorage["putanja"];
      //"prijavljeni ste kao: " + payload.Ime + " " + payload.Prezime + ", uloga: " + this.role;
    }
    //if (this.ino) {
    //    this.odabranijezik = "en";
    //} else {
    //    this.odabranijezik = "sr";
    //}
    //this.i18n.setLocale(this.odabranijezik);
  }
  get ulogovan() {
    let payload = this.authService.getTokenPayload();
    if (payload) {
      if (Array.isArray(payload.unique_name))
        this.korisnik = payload.unique_name[0];
      else
        this.korisnik = payload.unique_name;
      this.role = payload.role;
      return `prijavljeni ste kao: ${payload.Ime} ${payload.Prezime} (${this.korisnik}), uloga: ${this.role}, email: ${payload.email}`;
    }
  }

  @computedFrom('authService.authenticated')
  get authenticated() {
    return this.authService.authenticated;
  }

  vidljiv(meni) {
    if (!meni.settings.roles) return true;
    //if (!meni.settings.ino) return false;
    if (this.ino) {
      return meni.settings.roles.toString().indexOf(this.role) !== -1 && (meni.settings.ino);
    } else {
      return meni.settings.roles.toString().indexOf(this.role) !== -1;
    }
  }
  onSelectJezik(e) {
    var dataItem = this.cboJezik.dataItem(e.item.index());

    this.i18n.setLocale(dataItem.id);
    moment.locale(dataItem.id);

    this.repo.post('Korisnik/PromenaJezika', { jezik: dataItem.id })
      .then(result => {
        //this.controller.ok();
      })
      .catch(err => {
        toastr.error(err.statusText);
      });
  }
  configureRouter(config, router) {
    //config.options.pushState = true;
    //config.options.root = '/';
    config.title = 'TUV';
    config.addPipelineStep('authorize', AuthenticateStep);
    config.addPipelineStep('authorize', AuthenticateStepRole);
    config.map(routes);
    //if (this.role === 'Ino kupac') {
    //    config.map(routesIno);
    //} else {
    //    config.map(routes);    
    //}

    this.router = router;
  }

  @computedFrom('authService.authenticated')
  get authenticated() {
    return this.authService.authenticated;
  }
  pretraga() {
    //toastr.info("Pretraga: " + this.search);
    if (this.search.substring(0, 2) === 'RN') {
      let spl = this.search.split('|');
      let rbr = spl[0].substring(3, spl[0].length);
      let rnid = spl[1];
      this.router.navigateToRoute('nalog', { id: rnid });
      this.altairCommon.altair_main_header.search_hide();
    }
  }
  profil() {
    this.authService.getMe()
      .then(profile => {
        console.log(profile);
      });
  }

  //noviKorisnik() {
  //    if (this.role !== 'Administrator')
  //        return;
  //    let obj = { message: "Novi korisnik" };

  //    this.dialogService.open({viewModel: Prompt, model: obj }).then(response => {
  //        console.log(response);
  //        if (!response.wasCancelled) {
  //            console.log('not cancelled');
  //        } else {
  //            console.log('cancelled');
  //        }
  //        console.log(response.output);
  //    });
  //}

  promenaLozinke() {

    this.dialogService.open({ viewModel: Promena, model: this.i18n.tr("Promena lozinke za korisnika") + " " + this.korisnik }).then(response => {
      //console.log(response);
      if (!response.wasCancelled) {
        toastr.success(this.i18n.tr("Uspešna promena lozinke"));
        this.authService.logout()
          .then(() => {
            toastr.success(this.i18n.tr("Uspešna odjava"));
            //location.reload();
            this.aur.setRoot('pages/login/login');
          });
      } else {
        console.log('cancelled');
      }
      //console.log(response.output);
    });
  }

  logout() {
    UIkit.modal.confirm(this.i18n.tr('Da li želite da se odjavite?'), () => {
      //UIkit.modal.alert('Confirmed!'); 
      this.authService.logout()
        .then(() => {
          toastr.success(this.i18n.tr("Uspešna odjava"));
          //location.reload();
          this.aur.setRoot('pages/login/login');
        });
    });
    //this.dialogService.open({viewModel: Prompt, model: 'Da li želite da se odjavite?' }).then(response => {
    //    console.log(response);
    //    if (!response.wasCancelled) {
    //        this.authService.logout()
    //          .then(() => {
    //              toastr.success("Uspešna odjava");
    //              //location.reload();
    //              this.aur.setRoot('login');
    //          });
    //    } else {
    //        console.log('cancelled');
    //    }
    //    console.log(response.output);
    //});
    //this.dialogService.open({ viewModel: Prompt, model: 'Good or Bad?'}).then(response => {
    //    if (!response.wasCancelled) {
    //        console.log('good');
    //    } else {
    //        console.log('bad');
    //    }
    //    console.log(response.output);
    //});
    //this.authService.logout('#/login')
    //  .then(() => {
    //        toastr.success("uspešna odjava");
    //    });
  }

  @delayed
  attached() {
    // page onload functions
    this.altairCommon.altair_page_onload.init();

    //// main header
    this.altairCommon.altair_main_header.init();

    //// main sidebar
    this.altairCommon.altair_main_sidebar.init();
    //// secondary sidebar
    this.altairCommon.altair_secondary_sidebar.init();

    //// top bar
    this.altairCommon.altair_top_bar.init();

    //// page heading
    this.altairCommon.altair_page_heading.init();

    //// material design
    this.altairCommon.altair_md.init();


    //// forms
    this.altairCommon.altair_forms.init();

    //// truncate text helper
    this.altairCommon.altair_helpers.truncate_text($('.truncate-text'));

    //// full screen
    this.altairCommon.altair_helpers.full_screen();

    //// table check
    this.altairCommon.altair_helpers.table_check();

    //ie fix
    this.altairCommon.altair_helpers.ie_fix();

    if (Modernizr.touch) {
      // fastClick (touch devices)
      FastClick.attach(document.body);
    }
    this.subscriber = this.ea.subscribe('router:navigation:processing', response => {
      //console.log('Router ');
      //this.altairCommon.altair_helpers.content_preloader_show('md');
    });
    this.subscriber2 = this.ea.subscribe('router:navigation:complete', function (response) {
      //console.log('Router ');
      //this.altairCommon.altair_helpers.content_preloader_hide();
    });
  }
  detached() {
    this.subscriber.dispose();

  }
}



