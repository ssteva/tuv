import { Config, Endpoint } from 'aurelia-api';
import { inject } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { EntityManager } from 'aurelia-orm';
import { DataCache } from 'helper/datacache';
import 'kendo/js/kendo.grid';
import 'kendo/js/kendo.dropdownlist';
import * as toastr from 'toastr';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';
import { EditZapis } from 'resources/elements/editzapis';
import { DialogService } from 'aurelia-dialog';

@inject(AuthService, EntityManager, AltairCommon, Endpoint.of(), Common, Router, DataCache, I18N, Config, DialogService)
export class Nalozi {


    constructor(authService, em, ac, repo, common, router, dc, i18n, config, dialogService) {
        this.authService = authService;
        this.repo = repo;
        //this.repoKorisnik = em.getRepository('korisnik');
        this.ac = ac;
        this.dc = dc;
        this.i18n = i18n;
        this.common = common;
        this.router = router;
        this.dialogService = dialogService;
        this.fajlEndpoint = config.getEndpoint('fajl');
        this.repoFinansije = em.getRepository('finansije');
        this.klijenti = [];
        
        let payload = this.authService.getTokenPayload();
        if (payload) {
            this.korisnik = payload.unique_name;
            this.role = payload.role;
        }
        this.klijentiFilter =
            {
                extra: false,
                ui: (element) => {
                    element.kendoDropDownList({
                        dataTextField: "naziv",
                        dataValueField: "id",
                        filter: "contains",
                        dataSource: this.klijenti
                    });
                },
                operators: {
                    string: {
                        contains: this.i18n.tr("Sadrže")
                    },
                    number: {
                        eq: this.i18n.tr("je jednak")
                    }
                }
            }
        this.statusiFilter =
            {
                extra: false,
                ui: (element) => {
                    element.kendoDropDownList({
                        dataTextField: "status",
                        dataValueField: "id",
                        filter: "contains",
                        dataSource: this.statusi
                    });
                },
                operators: {
                    string: {
                        contains: this.i18n.tr("Sadrže")
                    },
                    number: {
                        eq: this.i18n.tr("je jednak")
                    }
                }
            };
        this.datasource = new kendo.data.DataSource({
            pageSize: 10,
            batch: false,
            transport: {
                read: (o) => {
                    this.repo.post('Zapis/ListaSvi', o.data)
                        .then(result => {
                            o.success(result);
                        })
                        .catch(err => {
                            console.log(err.statusText);
                        });
                }
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: {
                data: "data",
                total: "total",
                model: {
                    id: "id",
                    fields: {
                        datum: { type: 'date' }
                        //vrednost: { type: 'number' }
                        //  ime: { type: 'string' },
                        //  prezime: { type: 'string' },
                        //  email: { type: 'string' },
                        //  uloga: { type: 'string' }
                    }
                }
            }
        });
    }
    activate() {
        var promises = [];
        promises.push(this.dc.dajSveKlijente());
        //promises.push(this.dc.getObim());
        //promises.push(this.dc.dajNalogStatuse());
        return Promise.all(promises)
            .then(res => {
                this.klijenti = res[0];
            })
            .catch(console.error);
    }

    izmena(zap) {
        let tmp = this.repoFinansije.getNewEntity();
        tmp.setData(zap, true);
        let orig = tmp.asObject();

        var objm = {};
        objm.zapis = zap;
        objm.new = false;
        objm.naslov = this.i18n.tr("Izmena zapisa");
        objm.vrsta = zap.vrsta;
        objm.repo = this.repo;
        objm.nalog = zap.radniNalog;
        objm.fajlEndpoint = this.fajlEndpoint;
        this.dialogService.open({ viewModel: EditZapis, model: objm })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    if (!response.wasCancelled) {
                        //this.uplate.push(response.output);
                        this.grid.dataSource.read();
                    }
                } else {
                    Object.assign(zap, orig);
                }


            });
    }

}
