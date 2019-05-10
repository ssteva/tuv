import {AuthService} from 'aurelia-authentication';
import {Aurelia, inject, computedFrom} from 'aurelia-framework';
import {AltairCommon} from 'helper/altair_admin_common';
import {activationStrategy} from 'aurelia-router';

@inject(Aurelia, AuthService, AltairCommon)
export class Login {
    isLoading;
    jezik = "SRB";
    username = "";

    password = "";

    constructor(Aurelia, authService, altairCommon) {
        this.app = Aurelia;
        this.authService = authService;
        this.providers = [];
        this.isLoading = false;
        this.altairCommon = altairCommon;
        this.username = "";
        this.password = "";
    }

    determineActivationStrategy() {
        return activationStrategy.replace; //replace the viewmodel with a new instance
        // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
        // or activationStrategy.noChange to explicitly use the default behavior
    }

    attached() {
        $('body').removeAttr('class');
        $('body').addClass('login_page');
        //// material design
        this.altairCommon.altair_md.init();
    }

    detached() {
        $('body').removeClass('login_page');
        //$('body').addClass('sidebar_main_open');
        //$('body').addClass('sidebar_main_swipe');

    }
    // make a getter to get the authentication status.
    // use computedFrom to avoid dirty checking
    //@computedFrom('authService.authenticated')
    //get authenticated() {
    //    return this.authService.authenticated;
    //}

    // use authService.login(credentialsObject) to login to your auth server
    login() {
        if (this.isLoading === true) {
            return;
        }
        this.isLoading = true;
        var credentialsObject = { username: this.username, password: this.password };
        this.authService.login(credentialsObject)
            .then(result => {
                if (result && result.authenticated) {
                    if (this.authService.getTokenPayload().role === 'Ino kupac') {
                        this.app.setRoot('appIno').then(() => this.isLoading = false);
                    } else {
                        this.app.setRoot('app').then(() => this.isLoading = false);
                    }
                    //this.isLoading = false;
                } else {
                    if (this.jezik==='ENG') {
                        toastr.error('Unsuccessfull login');
                    } else {
                        toastr.error('Pogrešna lozinka i/ili korisničkom ime');
                    }
                    this.isLoading = false;
                }
            })
            .catch(err => {
                console.log(err);
                this.isLoading = false;
            });
    };

    // use authService.logout to delete stored tokens
    // if you are using JWTs, authService.logout() will be called automatically,
    // when the token expires. The expiredRedirect setting in your authConfig
    // will determine the redirection option
    logout() {
        this.authService.logout();
    }

    // use authenticate(providerName) to get third-party authentication
    authenticate(name) {
        this.authService.authenticate(name)
            .then(response => {
                this.provider[name] = true;
            });
    }

    detached() {
        this.username = "";
        this.password = "";
    }
    promenijezik() {
        if (this.jezik === "SRB") {
            this.jezik = "ENG";
        } else {
            this.jezik = "SRB";
        }
    }
}
