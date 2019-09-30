import { AuthService } from 'aurelia-authentication';
import { customElement, bindable, bindingMode, inject, computedFrom } from 'aurelia-framework';
import { AltairCommon } from 'helper/altair_admin_common';
import { DialogService } from 'aurelia-dialog';
import { DataCache } from 'helper/datacache';

import { I18N } from 'aurelia-i18n';
import { Config, Endpoint } from 'aurelia-api';
import 'kendo/js/kendo.dropdownlist';
import { EditZapis } from './editzapis'
import { EntityManager } from 'aurelia-orm';

@customElement('zapisi2')
@inject(AuthService, AltairCommon, Endpoint.of(), DialogService, I18N, Config, DataCache, EntityManager)
export class Zapisi2 {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) zapisi = [];
    @bindable naslov = "";
    @bindable nalogid;
    @bindable nalog;
    @bindable lock;

    constructor(authService, ac, repo, dialogService, i18n, config, dc, em) {
        this.authService = authService;
        this.repo = repo;
        this.fajlEndpoint = config.getEndpoint('fajl');
        this.repoFinansije = em.getRepository('finansije');
        this.ac = ac;
        this.dc = dc;
        this.i18n = i18n;
        //this.common = common;

        this.dialogService = dialogService;

        let payload = this.authService.getTokenPayload();
        if (payload) {
            this.korisnik = payload.unique_name;
            this.role = payload.role;
        }
    }
    activate() {

    }
    afterAttached() {
        let promises = [];
        promises.push(this.repo.find("Zapis/Zapistemplate"));
        Promise.all(promises)
            .then(res => {
                this.zapisTemplate = res[0];
            })
            .catch(err => {
                toastr.error(err);
            });
        setTimeout(() => {
            this.ac.altair_md.init();
        }, 500);
        this.reloadDocs();
    }

    reloadDocs() {
        return this.dc.dajZapise(this.nalogid)
            .then(res => {
                this.zapisi = res;

            })
            .catch(console.error);
    }

    delete(zapis) {
        UIkit.modal.confirm(this.i18n.tr('Da li želite da obrišete dokument?'), () => {
            this.dc.brisiZapis(zapis.id)
                .then(res => {
                    this.reloadDocs();
                    if (document.getElementById("dodaj"))
                        document.getElementById("dodaj").value = "";

                })
                .catch(console.error);
        });
    }
    odobreno(zapis, ev) {
        console.log(zapis);
    }
    snimiZ() {
        //upis
        UIkit.modal.confirm(this.i18n.tr('Da li želite da sačuvate izmene?'), () => {
            this.repo.post('Zapis/SnimiZapise?nalogid=' + this.nalogid, this.zapisi)
                .then(result => {
                    if (result.success) {
                        toastr.success(this.i18n.tr("Uspešno snimljeno"));
                        this.reloadDocs();
                    } else {
                        toastr.error(this.i18n.tr("Greška prilikom upisa"));
                        toastr.error(result.message);
                    }
                })
                .catch(err => {
                    toastr.error(err);
                });
        });
    }
    izmena(zap) {
        let tmp = this.repoFinansije.getNewEntity();
        tmp.setData(zap, true);
        let orig = tmp.asObject();

        var objm = {};
        objm.zapis = zap;
        objm.new = false;
        objm.valuta = this.valuta;
        objm.naslov = this.i18n.tr("Izmena zapisa");
        objm.vrsta = this.vrsta;
        objm.repo = this.repo;
        objm.nalog = this.nalog;
        objm.fajlEndpoint = this.fajlEndpoint;
        this.dialogService.open({ viewModel: EditZapis, model: objm })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    if (!response.wasCancelled) {
                        //this.uplate.push(response.output);
                        this.reloadDocs();
                    }
                } else {
                    Object.assign(zap, orig);
                }


            });
    }
    novi() {
        let tmp = this.repoFinansije.getNewEntity();
        tmp.setData(this.zapisTemplate, true);
        let orig = tmp.asObject();

        var objm = {};
        objm.zapis = orig;
        objm.new = true;
        objm.naslov = this.i18n.tr("Novi zapis");
        objm.fajlEndpoint = this.fajlEndpoint;
        objm.repo = this.repo;
        objm.nalog = this.nalog;
        this.dialogService.open({ viewModel: EditZapis, model: objm })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    //this.uplate.push(response.output);
                    this.reloadDocs();
                }
            });

    }
}

//export class LowerCaseValueConverter {
//  toView(value) {
//    return value.toString().toLowerCase();
//  }
//}
//export class DatumValueConverter {
//  toView(value) {
//    if (!value) return "";
//    moment.locale('sr');
//    //return moment(value).format('LLLL');
//    return moment(value).format('DD.MM.YYYY');
//  }
//}
export class DatumVremeFajlValueConverter {
    toView(value) {
        if (!value) return "";
        moment.locale('sr');
        //return moment(value).format('LLLL');
        return moment(value).format('DD.MM.YYYY HH:mm:ss');
    }
}
export class SizeValueConverter {
    toView(value) {
        var bytes = value;
        if (bytes < 1024) return bytes + " Bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(0) + " MB";
        else return (bytes / 1073741824).toFixed(0) + " GB";

    }
}
//export class DinaraValueConverter {
//  toView(value) {
//    if (!value) return "";
//    return value.formatMoney(2, '.', ',');
//  }
//}
