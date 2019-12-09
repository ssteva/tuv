import { AuthService } from 'aurelia-authentication';
import { customElement, bindable, bindingMode, inject, computedFrom } from 'aurelia-framework';
import { AltairCommon } from 'helper/altair_admin_common';
import { DialogService } from 'aurelia-dialog';
import { DataCache } from 'helper/datacache';
import { Common } from 'helper/common';
import { I18N } from 'aurelia-i18n';
import { Config, Endpoint } from 'aurelia-api';
import 'kendo/js/kendo.dropdownlist';
import { EditFaktura } from './editfaktura'
import { EntityManager } from 'aurelia-orm';

@customElement('fakture')
@inject(AuthService, AltairCommon, Endpoint.of(), Common, DialogService, I18N, Config, DataCache, EntityManager)
export class Fakture {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) fakture = [];
    @bindable naslov = "";
    @bindable nalogid;
    @bindable lock;

    constructor(authService, ac, repo, common, dialogService, i18n, config, dc , em) {
        this.authService = authService;
        this.repo = repo;
        this.ac = ac;
        this.dc = dc;
        this.em = em;
        this.repoFinansije = em.getRepository('finansije');
        this.i18n = i18n;
        this.common = common;

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
        this.ac.altair_md.init();
        let promises = [];
        promises.push(this.repo.find('Finansije/Faktura?id=0'), this.repo.find('Finansije/Faktura?id=0'));
        Promise.all(promises)
            .then(res => {
                this.fakturaTemplate = res[0];
                this.uplataTemplate = res[1];
            })
            .catch(err => {
                toastr.error(err);
            });
        this.reload();
    }
    suma() {
        this.vrednost = this.fakture.reduce((sum, stavka) => sum + (stavka.iznos), 0)
    }
    reload() {
        return this.dc.dajFakture(this.nalogid)
            .then(res => {
                this.fakture = res;
                this.suma();
            })
            .catch(console.error);
    }
    delete(obj) {
        UIkit.modal.confirm(this.i18n.tr('Da li želite da obrišete fakturu?'), () => {
            this.dc.brisiFakturu(obj.id)
                .then(res => {
                    this.reload();
                })
                .catch(console.error);
        });
    }
    izmena(upl) {
        let tmp = this.repoFinansije.getNewEntity();
        tmp.setData(upl, true);
        let orig = tmp.asObject();

        var objm = {};
        objm.faktura = orig;
        objm.new = true;
        objm.naslov = this.i18n.tr("Izmena fakture");

        this.dialogService.open({ viewModel: EditFaktura, model: objm })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    //this.uplate.push(response.output);
                    this.repo.post('Finansije/SnimiFakturu?nalogid=' + this.nalogid, response.output)
                        .then(result => {
                            if (result.success) {
                                toastr.success(this.i18n.tr("Uspešno snimljeno"));
                                this.reload();
                            } else {
                                toastr.error(this.i18n.tr("Greška prilikom upisa"));
                                toastr.error(result.message);
                            }
                        })
                        .catch(err => {
                            toastr.error(err);
                        });
                } else {
                    Object.assign(upl, orig);
                }


            });
    }
    novi() {
        let tmp = this.repoFinansije.getNewEntity();
        tmp.setData(this.fakturaTemplate, true);
        let orig = tmp.asObject();

        var objm = {};
        objm.faktura = orig;
        objm.new = true;
        objm.naslov = this.i18n.tr("Nova faktura");

        this.dialogService.open({ viewModel: EditFaktura, model: objm })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    //this.uplate.push(response.output);
                    this.repo.post('Finansije/SnimiFakturu?nalogid=' + this.nalogid, response.output)
                        .then(result => {
                            if (result.success) {
                                toastr.success(this.i18n.tr("Uspešno snimljeno"));
                                this.reload();
                            } else {
                                toastr.error(this.i18n.tr("Greška prilikom upisa"));
                                toastr.error(result.message);
                            }
                        })
                        .catch(err => {
                            toastr.error(err);
                        });
                }
            });
    }
}
export class DinarafValueConverter {
    toView(value) {
        if (!value) return "";
        return value.formatMoney(2, ',', '.');
    }
}
//export class LowerCaseValueConverter {
//  toView(value) {
//    return value.toString().toLowerCase();
//  }
//}
export class DatumfValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('DD.MM.YYYY');
  }
}



