import { AuthService } from 'aurelia-authentication';
import { customElement, bindable, bindingMode, inject, computedFrom } from 'aurelia-framework';
import { AltairCommon } from 'helper/altair_admin_common';
import { DialogService } from 'aurelia-dialog';
import { DataCache } from 'helper/datacache';
import { Common } from 'helper/common';
import { I18N } from 'aurelia-i18n';
import { Config, Endpoint } from 'aurelia-api';
import 'kendo/js/kendo.dropdownlist';
import { EditFinansije } from './editfinansije'
import { EntityManager } from 'aurelia-orm';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

@customElement('finansije')
@inject(AuthService, AltairCommon, Endpoint.of(), Common, DialogService, I18N, Config, DataCache, EntityManager, EventAggregator)
export class Finansije {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) finansije = [];
    @bindable naslov = "";
    @bindable nalogid;
    @bindable lock;
    @bindable vrsta;
    @bindable valuta;
    constructor(authService, ac, repo, common, dialogService, i18n, config, dc, em, ea) {
        this.authService = authService;
        this.repo = repo;
        this.ac = ac;
        this.dc = dc;
        this.em = em;
        this.ea = ea;
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
        promises.push(this.repo.find("Finansije/Finansije?id=0&vrsta=F"), this.repo.find("Finansije/Finansije?id=0&vrsta=U"), this.repo.find("Finansije/Finansije?id=0&vrsta=T"));
        Promise.all(promises)
            .then(res => {
                this.fakturaTemplate = res[0];
                this.uplataTemplate = res[1];
                this.trosakTemplate = res[2];
            })
            .catch(err => {
                toastr.error(err);
            });
        this.reload();
    }
    suma() {
        this.vrednost = this.finansije.reduce((sum, stavka) => sum + (stavka.iznos), 0)
    }
    reload() {
        return this.dc.dajFinansije(this.nalogid, this.vrsta)
            .then(res => {
                this.finansije = res;
                this.suma();
            })
            .catch(console.error);
    }
    delete(obj) {
        let poruka;
        if (this.vrsta === "U")
            poruka = this.i18n.tr("Da li želite da obrišete uplatu?")
        else if (this.vrsta === "F") {
            poruka = this.i18n.tr("Da li želite da obrišete fakturu?")
        }
        else {
            poruka = this.i18n.tr("Da li želite da obrišete trošak?")
        }
        UIkit.modal.confirm(poruka, () => {
            this.dc.brisiFinansije(obj.id, this.vrsta)
                .then(res => {
                    this.reload();
                    this.publish();
                })
                .catch(console.error);
        });
    }
    publish() {
        this.ea.publish('rekapitulacija:refresh', true);
    }
    izmena(upl) {
        let tmp = this.repoFinansije.getNewEntity();
        tmp.setData(upl, true);
        let orig = tmp.asObject();

        var objm = {};
        objm.finansije = orig;
        objm.new = true;
        objm.valuta = this.valuta;
        //objm.naslov = this.vrsta === "U" ? this.i18n.tr("Izmena uplate") : this.i18n.tr("Izmena fakture");
        if (this.vrsta === "U")
            objm.naslov = this.i18n.tr("Izmena uplate")
        else if (this.vrsta === "F") {
            objm.naslov = this.i18n.tr("Izmena fakture")
        }
        else {
            objm.naslov = this.i18n.tr("Izmena unosa troška?")
        }
        objm.vrsta = this.vrsta;
        this.dialogService.open({ viewModel: EditFinansije, model: objm })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    //this.uplate.push(response.output);
                    this.repo.post('Finansije/Snimi?nalogid=' + this.nalogid, response.output)
                        .then(result => {
                            if (result.success) {
                                toastr.success(this.i18n.tr("Uspešno snimljeno"));
                                this.reload();
                                this.publish();

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
        if (this.vrsta === "U")
            tmp.setData(this.uplataTemplate, true);
        else if (this.vrsta === "F") {
            tmp.setData(this.fakturaTemplate, true);
        }
        else {
            tmp.setData(this.trosakTemplate, true);
        }
        //tmp.setData(this.vrsta === "U" ? this.uplataTemplate : this.fakturaTemplate, true);
        let orig = tmp.asObject();

        var objm = {};
        objm.finansije = orig;
        objm.new = true;
        //objm.naslov = this.vrsta === "U" ? this.i18n.tr("Nova uplata") : this.i18n.tr("Nova faktura");
        if (this.vrsta === "U")
            objm.naslov = this.i18n.tr("Unos nove uplate")
        else if (this.vrsta === "F") {
            objm.naslov = this.i18n.tr("Unos nove fakture")
        }
        else {
            objm.naslov = this.i18n.tr("Unos novog troška")
        }
        objm.valuta = this.valuta;
        objm.vrsta = this.vrsta;
        this.dialogService.open({ viewModel: EditFinansije, model: objm })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    //this.uplate.push(response.output);
                    this.repo.post('Finansije/Snimi?nalogid=' + this.nalogid, response.output)
                        .then(result => {
                            if (result.success) {
                                toastr.success(this.i18n.tr("Uspešno snimljeno"));
                                this.valuta = response.output.valuta;
                                this.reload();
                                this.publish();
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

export class DinarauValueConverter {
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
export class DatumuValueConverter {
    toView(value) {
        if (!value) return "";
        moment.locale('sr');
        //return moment(value).format('LLLL');
        return moment(value).format('DD.MM.YYYY');
    }
}



