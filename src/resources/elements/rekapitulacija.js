import { AuthService } from 'aurelia-authentication';
import { customElement, bindable, bindingMode, inject, computedFrom } from 'aurelia-framework';
import { AltairCommon } from 'helper/altair_admin_common';
import { DialogService } from 'aurelia-dialog';
import { DataCache } from 'helper/datacache';
import { Common } from 'helper/common';
import { I18N } from 'aurelia-i18n';
import { Config, Endpoint } from 'aurelia-api';
import 'kendo/js/kendo.dropdownlist';
//import { EditFinansije } from './editfinansije'
import { EntityManager } from 'aurelia-orm';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

@customElement('rekapitulacija')
@inject(AuthService, AltairCommon, Endpoint.of(), Common, DialogService, I18N, Config, DataCache, EntityManager, EventAggregator)
export class Rekapitulacija {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) finansije = [];
    @bindable naslov = "";
    @bindable nalogid;
    @bindable lock;
    @bindable ponudaid;
    @bindable klijentid;
    rekap;
    constructor(authService, ac, repo, common, dialogService, i18n, config, dc, em, ea) {
        this.authService = authService;
        this.repo = repo;
        this.ac = ac;
        this.dc = dc;
        this.em = em;
        this.repoFinansije = em.getRepository('finansije');
        this.i18n = i18n;
        this.ea = ea;
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
    detached() {
        this.subscriber.dispose();
    }
    afterAttached() {
        this.ac.altair_md.init();
        this.reload();
        this.subscriber = this.ea.subscribe('rekapitulacija:refresh', response => {
            this.reload();
        });
    }
    progress() {
        if (this.pbfr) {
            this.pbfr.value(this.rekap.procFakturisanoR)
        }
        if (this.pbfe) {
            this.pbfe.value(this.rekap.procFakturisanoE)
        }
        if (this.pbfu) {
            this.pbfu.value(this.rekap.procFakturisanoU)
        }
        if (this.pbur) {
            this.pbur.value(this.rekap.procUplacenoR)
        }
        if (this.pbue) {
            this.pbue.value(this.rekap.procUplacenoE)
        }
        if (this.pbuu) {
            this.pbuu.value(this.rekap.procUplacenoU)
        }
    }
    suma() {
        //this.vrednost = this.finansije.reduce((sum, stavka) => sum + (stavka.iznos), 0)
    }
    reload() {

        return this.repo.find('Finansije/Rekapitulacija?dat1=&dat2=&klijentid=' + this.klijentid + "&ponudaid=" + this.ponudaid + "&radninalogid=" + this.nalogid)
            .then(result => {
                if (result.success) {
                    this.rekap = result.obj;
                    this.progress();
                } else {
                    toastr.error(this.i18n.tr("Greška prilikom upisa"));
                    toastr.error(result.message);
                }
            })
            .catch(err => {
                toastr.error(err);
            });
    }

    delete(obj) {
        let poruka = this.vrsta === "U" ? this.i18n.tr("Da li želite da obrišete uplatu?") : this.i18n.tr("Da li želite da obrišete fakturu?");
        UIkit.modal.confirm(poruka, () => {
            this.dc.brisiFinansije(obj.id, this.vrsta)
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
        objm.finansije = orig;
        objm.new = true;
        objm.valuta = this.valuta;
        objm.naslov = this.vrsta === "U" ? this.i18n.tr("Izmena uplate") : this.i18n.tr("Izmena fakture");
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

}

export class DinararValueConverter {
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
export class DatumrValueConverter {
    toView(value) {
        if (!value) return "";
        moment.locale('sr');
        //return moment(value).format('LLLL');
        return moment(value).format('DD.MM.YYYY');
    }
}



