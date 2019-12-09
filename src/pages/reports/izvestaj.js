import { inject } from 'aurelia-framework';
//import {DialogController, DialogService} from 'aurelia-dialog';
import { AltairCommon } from 'helper/altair_admin_common';
//import {EntityManager} from 'aurelia-orm';
import { Endpoint } from 'aurelia-api';
import { AuthService } from 'aurelia-authentication';
import { Router } from 'aurelia-router';
import { DataCache } from 'helper/datacache';
import { I18N } from 'aurelia-i18n';
import 'kendo/js/kendo.pivotgrid';
import 'kendo/js/kendo.pivot.configurator';
import 'kendo/js/kendo.pivot.fieldmenu';

import 'kendo/js/kendo.datepicker';
import 'kendo/js/kendo.sortable';

//import {DOM} from 'aurelia-pal';
//import {observable} from "aurelia-framework";

@inject(AltairCommon, Endpoint.of(), AuthService, Router, DataCache, I18N)
export class Izvestaj {
    podaci;
    constructor(ac, repo, authService, router, dc, i18n) {
        this.ac = ac;
        this.repo = repo;
        this.authService = authService;
        this.dc = dc;
        this.isLoading = false;
        this.router = router;
        this.i18n = i18n;
        let payload = this.authService.getTokenPayload();

        if (payload) {
            this.role = payload.role;
            this.korisnik = payload.unique_name;
            this.jezik = payload.Jezik;
        }

        this.excel = {
            fileName: 'Kendo UI PivotGrid Export.xlsx',
            proxyURL: '//demos.telerik.com/kendo-ui/service/export',
            filterable: true
        };
        if (this.jezik === 'sr') {
            kendo.ui.PivotSettingTarget.fn.options.messages = {
                empty: this.i18n.tr("Prevući ovde")
            };
        }


        this.schema = {
            model: {
                fields: {
                    datum: { type: 'date' },
                    godina: { type: 'number' },
                    mesec: { type: 'number' },
                    kn: { type: 'number' },
                    klijent: { type: 'string' },
                    ponuda: { type: 'string' },
                    nalog: { type: 'string' },
                    valuta: { type: 'string' },
                    ponudaR: { type: 'number' },
                    ponudaE: { type: 'number' },
                    ponudaU: { type: 'number' },
                    pponudaR: { type: 'number' },
                    pponudaE: { type: 'number' },
                    pponudaU: { type: 'number' },
                    fakturaR: { type: 'number' },
                    fakturaU: { type: 'number' },
                    fakturaU: { type: 'number' },
                    uplataR: { type: 'number' },
                    uplataE: { type: 'number' },
                    uplataU: { type: 'number' }
                }
            },
            cube: {
                dimensions: {
                    godina: { caption: this.i18n.tr('Godina') },
                    mesec: { caption: this.i18n.tr('Mesec') },
                    kn: { caption: this.i18n.tr('Kn') },
                    klijent: { caption: this.i18n.tr('Klijent') },
                    ponuda: { caption: this.i18n.tr('Ponuda') },
                    nalog: { caption: this.i18n.tr('Nalog') },
                    valuta: { caption: this.i18n.tr('Valuta') }
                },
                measures: this.jezik === 'sr' ? {
                    'Broj ponuda': { field: 'idponuda', format: '{0:n0}', aggregate: CountDistinctAggregate },
                    'Broj prihvaćenih ponuda': { field: 'brojPrihvacenihPonuda', format: '{0:n0}', aggregate: CountDistinctAggregate },
                    'Broj naloga': { field: 'idnalog', format: '{0:n0}', aggregate: CountDistinctAggregate },
                    'Ponuda eur': { field: 'ponudaE', format: '{0:n0}', aggregate: 'sum' },
                    'Ponude rsd': { field: 'ponudaR', format: '{0:n0}', aggregate: 'sum' },
                    'Ponuda svedeno eur': { field: 'ponudaU', format: '{0:n0}', aggregate: 'sum' },
                    'Prihv ponuda eur': { field: 'pponudaE', format: '{0:n0}', aggregate: 'sum' },
                    'Prihv ponuda rsd': { field: 'pponudaR', format: '{0:n0}', aggregate: 'sum' },
                    'Prihv ponuda svedeno eur': { field: 'pponudaU', format: '{0:n0}', aggregate: 'sum' },
                    'Fakturisano eur': { field: 'ponudaE', format: '{0:n0}', aggregate: 'sum' },
                    'Fakturisano rsd': { field: 'ponudaR', format: '{0:n0}', aggregate: 'sum' },
                    'Fakturisano ukupno eur': { field: 'ponudaU', format: '{0:n0}', aggregate: 'sum' },
                    'Uplaćeno eur': { field: 'ponudaE', format: '{0:n0}', aggregate: 'sum' },
                    'Uplaćeno rsd': { field: 'ponudaR', format: '{0:n0}', aggregate: 'sum' },
                    'Uplaćeno ukupno eur': { field: 'ponudaU', format: '{0:n0}', aggregate: 'sum' },
                    'Troškovi ukupno eur': { field: 'ponudaU', format: '{0:n0}', aggregate: 'sum' }
                } :
                    {
                        'Offers count': { field: 'idponuda', format: '{0:n0}', aggregate: CountDistinctAggregate },
                        'Accepted offers count': { field: 'brojPrihvacenihPonuda', format: '{0:n0}', aggregate: CountDistinctAggregate },
                        'Work orders count': { field: 'idnalog', format: '{0:n0}', aggregate: CountDistinctAggregate },
                        'Offered eur': { field: 'ponudaE', format: '{0:n0}', aggregate: 'sum' },
                        'Offered rsd': { field: 'ponudaR', format: '{0:n0}', aggregate: 'sum' },
                        'Offered total eur': { field: 'ponudaU', format: '{0:n0}', aggregate: 'sum' },
                        'Accepted offers eur': { field: 'pponudaE', format: '{0:n0}', aggregate: 'sum' },
                        'Accepted offers rsd': { field: 'pponudaR', format: '{0:n0}', aggregate: 'sum' },
                        'Accepted offers total eur': { field: 'pponudaU', format: '{0:n0}', aggregate: 'sum' },
                        'Invoiced eur': { field: 'ponudaE', format: '{0:n0}', aggregate: 'sum' },
                        'Invoiced rsd': { field: 'ponudaR', format: '{0:n0}', aggregate: 'sum' },
                        'Invoiced total eur': { field: 'ponudaU', format: '{0:n0}', aggregate: 'sum' },
                        'Paid eur': { field: 'ponudaE', format: '{0:n0}', aggregate: 'sum' },
                        'Paid rsd': { field: 'ponudaR', format: '{0:n0}', aggregate: 'sum' },
                        'Paid total eur': { field: 'ponudaU', format: '{0:n0}', aggregate: 'sum' },
                        'Costs total eur': { field: 'ponudaU', format: '{0:n0}', aggregate: 'sum' }
                    }

            }
        };

        function CountDistinctAggregate(value, state, context) {
            if (!state.distinctList) {
                state.distinctList = new Array();
            }
            if ($.inArray(value, state.distinctList) < 0 && value) {
                state.distinctList.push(value);
                return (state.accumulator || 0) + 1;
            }
            else {
                return (state.accumulator || 0);
            }
        }
        if (this.jezik === 'sr') {
            kendo.ui.PivotFieldMenu.fn.options.messages = {
                info: "Info",
                sortAscending: "Rastuće",
                sortDescending: "Opadajuće",
                filterFields: "Filter polja",
                filter: "Filter",
                include: "Uključuje",
                title: "Naslov",
                clear: "Poništi",
                ok: "Ok",
                cancel: "Odustani",
                operators: {
                    contains: "Sadrži",
                    doesnotcontain: "Ne sadrži",
                    startswith: "Počinje sa",
                    endswith: "Završava se sa",
                    eq: "Iznosi",
                    neq: "Različito od"
                }
            };

            kendo.ui.PivotConfigurator.fn.options.messages = {
                measures: "Prevući mere",
                columns: "Prevući kolone",
                rows: "Prevući redove",
                measuresLabel: "Mere",
                columnsLabel: "Kolone",
                rowsLabel: "Redovi",
                fieldsLabel: "Dimenzije"
            };

            kendo.ui.PivotGrid.fn.options.messages = {
                measureFields: "Mere",
                columnFields: "Kolone",
                rowFields: "Redovi"
            };
        }

    }

    onSelectPeriod(e) {
        let dataItem = this.cboPeriod.dataItem(e.item);
    }
    activate() {
        //let promises = [this.dc.getServisi()];
        //return Promise.all(promises).then(res => {
        //    this.servisi = res[0];
        //});
        this.disable = false;
        return this.repo.post('Izvestaj/Datumi')
            .then(result => {
                this.dat1 = result[0].dat1;
                this.dat2 = result[0].dat2;
                if (moment(result[0].dat1).year())
                    this.disable = true;
            })
            .catch(err => {
                console.log(err.statusText);
            });

        //return this.repo.post('Izvestaj/Pivot')
        //    .then(result => {
        //        this.podaci = result;


        //    })
        //    .catch(err => {
        //        console.log(err.statusText);
        //    });
    }
    dataBound(dis, e) {
        //var tags = $(e.target).find(".k-settings-measures > span.k-button");

    }
    izvestaj() {
        let obj = { dat1: this.dat1, dat2: this.dat2 }
        var columns = this.pivotconfigurator.dataSource.columns();
        var rows = this.pivotconfigurator.dataSource.rows();
        var measures = this.pivotconfigurator.dataSource.measures();
        return this.repo.post('Izvestaj/Pivot', obj)
            .then(result => {
                if (columns.length && rows.length || measures.legnth) {
                    this.pivotgrid.setDataSource(new kendo.data.PivotDataSource({
                        data: [],
                        schema: this.schema
                        , columns: columns,
                        rows: rows,
                        measures: measures
                    })
                    );
                }
                this.podaci = result;
                this.pivotgrid.dataSource.data(this.podaci);
                //if (columns.length && rows.length || measures.legnth) {
                //    this.pivotgrid.dataSource.expandColumn(columns[0].name);
                //    this.pivotgrid.dataSource.expandRow(rows[0].name);
                //}
            })
            .catch(err => {
                console.log(err.statusText);
            });
    }
    afterAttached() {
        this.dataSource = new kendo.data.PivotDataSource({
            data: this.podaci,
            schema: this.schema
            //,
            //columns: [{ name: 'mesec', expand: true }],
            //rows: [{ name: 'uredjaj', expand: true }],
            //measures: ['Troškovi', 'Broj naloga']
        });
        //var pivot = $("#pivotgrid").kendoPivotGrid().data("kendoPivotGrid");
        var pivotConfigurator = $("#pivotconfigurator").data("kendoPivotConfigurator");
        //pivot.setDataSource(this.dataSource);
        pivotConfigurator.setDataSource(this.dataSource);

        //var el = $("#pivotconfigurator").find('.k-bot .k-in');

        var source = pivotConfigurator.treeView.dataSource;
        source.get("Measures").set("caption", this.i18n.tr("Mere (vrednosti)"));
        var nod = source.get("Measures");
        var node = pivotConfigurator.treeView.findByUid(nod.uid);
        pivotConfigurator.treeView.expand(node);
        //source.one("change", function() {
        //    source.get("Measures").set("caption", "Mere (vrednosti)");
        //});
    }

    //get datum() {
    //    return moment().format('DD.MM.YYYY hh:mm:ss'); 
    //}
    export() {
        this.pivotgrid.saveAsExcel();
    }
    stampa() {
        //var printContents = document.getElementById('printSection').innerHTML;
        //var originalContents = document.body.innerHTML;

        //document.body.innerHTML = printContents;

        window.print();

        //document.body.innerHTML = originalContents;
    }
}
export class DatumVremeValueConverter {
    toView(value) {
        moment.locale('sr');
        return moment(value).format('DD.MM.YYYY');
    }
}

