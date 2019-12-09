import { Endpoint } from 'aurelia-api';
import { inject, BindingEngine, computedFrom } from 'aurelia-framework';
import { activationStrategy } from 'aurelia-router';
import { AuthService } from 'aurelia-authentication';
import { EntityManager } from 'aurelia-orm';
import 'kendo/js/kendo.dropdownlist';
import 'kendo/js/kendo.datepicker';
import 'kendo/js/kendo.numerictextbox';
import 'kendo/js/kendo.multiselect';
import { DialogService } from 'aurelia-dialog';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';
import { DataCache } from 'helper/datacache';
import { I18N } from 'aurelia-i18n';
import { Config } from 'aurelia-api';
import { Prompt } from '../../helper/prompt';

@inject(AuthService, EntityManager, AltairCommon, Endpoint.of(), Common, DialogService, Router, I18N, DataCache, Config, BindingEngine)
export class Ponuda {

    determineActivationStrategy() {
        return activationStrategy.replace; //replace the viewmodel with a new instance
        // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
        // or activationStrategy.noChange to explicitly use the default behavior
    }
    constructor(authService, em, ac, repo, common, dialogService, router, i18n, dc, config, bindingEngine) {
        this.authService = authService;
        this.repo = repo;
        this.ac = ac;
        this.dc = dc;
        this.i18n = i18n;
        this.common = common;
        this.fajlEndpoint = config.getEndpoint('fajl');
        this.em = em;
        this.repoKontakt = em.getRepository('kontakt');
        this.dialogService = dialogService;
        this.router = router;
        this.bindingEngine = bindingEngine;
        //this.obimOdabir = [];
        this.obimi = [];
        let payload = this.authService.getTokenPayload();
        if (payload) {
            this.role = payload.role;
            this.jezik = payload.Jezik;
            //this.korisnikid = payload.nameid
            if (Array.isArray(payload.unique_name))
                this.korisnikid = payload.unique_name[0];
            else
                this.korisnikid = payload.unique_name;
        }

    }
    activate(params, routeData) {
        let promises = [];
        var p = this.repo.find('Nalog', params.id);
        promises.push(p, this.dc.dajIzvrsioce(), this.dc.dajRukovodioce());
        promises.push(this.repo.find('Korisnik', this.korisnikid));
        //promises.push(this.dc.getObim());
        if (params.id.toString() === "0") {
            promises.push(this.repo.find('Ponuda', params.idp));
        }
        //promises.push(this.repo.find("Ponuda/PonudaStavka?id=0"));
        //promises.push(this.repo.find("Nalog/NalogPredmet?id=0"));

        return Promise.all(promises)
            .then(res => {
                this.nalog = res[0];
                this.izvrsioci = res[1];
                this.rukovodioci = res[2];
                this.korisnik = res[3];

                if (params.id.toString() === "0") {
                    this.nalog.ponuda = res[4];
                    if (this.obimi.length === 1) {
                        this.nalog.predmetNaloga = this.obimi[0];
                    }
                }
                this.nalog.ponuda.predmetPonude.forEach(e => {
                    e.obimPoslovanja.naziv = e.obimPoslovanja.sifra + " " + e.obimPoslovanja.naziv;
                    e.obimPoslovanja.grupa = (e.obimPoslovanja.sekundarna ? e.obimPoslovanja.sekundarna.naziv : (e.obimPoslovanja.primarna ? e.obimPoslovanja.primarna.naziv : ''));
                    this.obimi.push(e.obimPoslovanja);
                })
                if (params.id.toString() === "0") {
                    if (this.obimi.length === 1) {
                        this.nalog.predmetNaloga = this.obimi[0];
                    }
                }

                this.dataSource = new kendo.data.DataSource({
                    data: this.obimi,
                    group: { field: "grupa" }
                });
            })
            .catch(err => {
                toastr.error(err);
            });

    }
    @computedFrom('nalog.status')
    get lock() {
        if (this.nalog.zatvoren) {
            this.zakljucaj(false);
            return true;
        }
        else {
            this.zakljucaj(true);
            return false;
        }
        //return this.ponuda.status >= 2 ? true : false;
    }

    navigatePonuda(id, idk) {
        this.router.navigateToRoute('ponuda', { id: id, idk: idk });
    }
    navigateKlijent(id) {
        this.router.navigateToRoute('klijent', { id: id });
    }
    afterAttached() {
        this.ac.altair_md.init();
        if (this.lock) {
            this.zakljucaj(false);
        }
    }
    onSelectObim(e) {
        let dataItem = this.cboObim.dataItem(e.item);
        if (dataItem.id)
            this.nalog.predmetNaloga = dataItem;
        else
            this.nalog.predmetNaloga = null;
    }

    zakljucaj(parametar) {
        if (this.cboZaduzenZaRealizaciju)
            this.cboZaduzenZaRealizaciju.enable(parametar);
        if (this.cboObim)
            this.cboObim.enable(parametar);
        if (this.cboDatumVazenja)
            this.cboDatumVazenja.enable(parametar);
    }
    
    zatvori() {
        UIkit.modal.confirm(this.i18n.tr('Da li želite da zaključate nalog?'), () => {
            this.nalog.zatvoren = true;
            this.snimiBaza();
        });
        
    }
    otvori() {
        UIkit.modal.confirm(this.i18n.tr('Da li želite da otključate nalog?'), () => {
            this.nalog.zatvoren = false;
            this.snimiBaza();
        });
    }
    snimi() {
        //validacija
        if (!this.nalog.zaduzenZaRealizaciju) {
            toastr.error(this.i18n.tr("Izvšilac zadužen za realizaciju je obavezan podatak"));
            return;
        }

        //upis
        UIkit.modal.confirm(this.i18n.tr('Da li želite da sačuvate izmene?'), () => {
            this.snimiBaza();
        });
    }
    snimiBaza() {
        var id = this.nalog.id;

        this.repo.update('Nalog/' + this.nalog.id, "", this.nalog)
            .then(result => {
                if (result.success) {
                    toastr.success(this.i18n.tr("Uspešno snimljeno"));
                    this.nalog = result.obj;
                    if (id === 0) {
                        this.router.navigateToRoute('nalog', { id: this.nalog.id, idp: this.nalog.ponuda.id });
                        //this.zakljucaj();
                    }
                } else {
                    toastr.error(this.i18n.tr("Greška prilikom upisa"));
                    toastr.error(result.message);
                }
            })
            .catch(err => {
                toastr.error(err);
            });

    }

}

export class LowerCaseValueConverter {
    toView(value) {
        return value.toString().toLowerCase();
    }
}
export class DatumValueConverter {
    toView(value) {
        if (!value) return "";
        moment.locale('sr');
        //return moment(value).format('LLLL');
        return moment(value).format('DD.MM.YYYY');
    }
}
export class DatumVremeValueConverter {
    toView(value) {
        if (!value) return "";
        moment.locale('sr');
        //return moment(value).format('LLLL');
        return moment(value).format('DD.MM.YYYY HH:mm:ss');
    }
}
Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
export class DinaraValueConverter {
    toView(value) {
        if (!value) return "";
        return value.formatMoney(2, ',', '.');
    }
}
export class DanValueConverter {
    toView(value) {
        if (!value) return "";
        moment.locale('sr');
        //return moment(value).format('LLLL');
        return moment(value).format('DD');
    }
}
export class MesecValueConverter {
    toView(value) {
        if (!value) return "";
        moment.locale('sr');
        //return moment(value).format('LLLL');
        return moment(value).format('MMM');
    }
}
export class GodinaValueConverter {
    toView(value) {
        if (!value) return "";
        moment.locale('sr');
        //return moment(value).format('LLLL');
        return moment(value).format('YY');
    }
}
