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

@inject(AuthService, EntityManager, AltairCommon, Endpoint.of(), Common, Router, DataCache, I18N, Config)
export class Ponude {


    constructor(authService, em, ac, repo, common, router, dc, i18n, config) {
        this.authService = authService;
        this.repo = repo;
        //this.repoKorisnik = em.getRepository('korisnik');
        this.ac = ac;
        this.dc = dc;
        this.i18n = i18n;
        this.common = common;
        this.router = router;
        this.fajlEndpoint = config.getEndpoint('fajl2');
        this.statusi = [];
        this.klijenti = [];
        this.obimi = [];
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
            };
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
                    this.repo.post('Ponuda/PregledGrid', o.data)
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
                        datumPonude: { type: 'date' },
                        datumVazenja: { type: 'date' },
                        vrednost: { type: 'number' }
                        
                        //  ime: { type: 'string' },
                        //  prezime: { type: 'string' },
                        //  email: { type: 'string' },
                        //  uloga: { type: 'string' }
                    }
                }
            }
            ,aggregate: [
                { field: "vrednost", aggregate: "sum" },
                { field: "vrednostSvedenoEur", aggregate: "sum" }
            ]
        });
    }
    activate() {
        var promises = [];
        promises.push(this.dc.dajSveKlijente());
        promises.push(this.dc.getObim());
        promises.push(this.dc.dajPonudaStatuse());
        return Promise.all(promises)
            .then(res => {
                this.klijenti = res[0];
                this.obimi = res[1];
                this.statusi = res[2];
            })
            .catch(console.error);
    }
    stampa(obj) {
        this.fajlEndpoint.find("Template/", obj.id)
            .then(result => {
                //console.log(1);
            })
            .catch(err => {
                toastr.error(err);
            });
    }
    izmena(obj, e) {

        this.router.navigateToRoute("ponuda", { id: obj.id });
    }

    novi() {
        this.router.navigateToRoute("ponuda", { id: 0 });
    }
    nalog(obj) {
        this.router.navigateToRoute("nalog", { id: 0, idp: obj.id });
    }
    detailInit(e) {
        let detailRow = e.detailRow;

        detailRow.find('.tabstrip').kendoTabStrip({
            animation: {
                open: { effects: 'fadeIn' }
            }
        });

    }
}
