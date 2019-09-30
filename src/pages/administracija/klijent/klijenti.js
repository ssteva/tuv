import {Endpoint} from 'aurelia-api';
import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';
import {EntityManager} from 'aurelia-orm';
import 'kendo/js/kendo.grid';
import 'kendo/js/kendo.dropdownlist';
import 'kendo/js/kendo.tabstrip';
import * as toastr from 'toastr';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';

@inject(AuthService, EntityManager, AltairCommon,  Endpoint.of(), Common, Router)
export class Klijenti {
  

  constructor(authService, em, ac,  repo, common, router) {
    this.authService = authService;
    this.repo = repo;
    //this.repoKorisnik = em.getRepository('korisnik');
    this.ac = ac;
    this.common = common;
    this.router = router;
    this.repoKlijent = em.getRepository('klijent');
    let payload = this.authService.getTokenPayload();
    if (payload) {
      this.korisnik = payload.unique_name;
      this.role = payload.role;
    }
    this.datasource = new kendo.data.DataSource({
      pageSize: 10,
      batch: false,
      transport: {
        read: (o) => {
          this.repo.post('Klijent/PregledGrid', o.data)
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
          id: "id"
          //fields: {
          //  ime: { type: 'string' },
          //  prezime: { type: 'string' },
          //  email: { type: 'string' },
          //  uloga: { type: 'string' }
          //}
        }
      }
    });
  }
  izmena(obj, e) {
    if (this.role !== 'Administrator') return;
    // obj.edit = true;
    // this.grid.refresh();
    //let objm = {
    //  naslov: `${obj.naziv}`,
    //  roles: this.common.roles,
    //  korisnik: obj,
    //  repo: this.repo
    //};

    //this.dialogService.open({viewModel: EditKorisnik, model: objm})
    //  .whenClosed(response => {
    //    console.log(response);
    //    if (!response.wasCancelled) {
    //      //console.log('not cancelled');
    //      this.datasource.read();
    //  } else {
    //    console.log('cancelled');
    //  }
    //});
    this.router.navigateToRoute("klijent", { id: obj.id });
  }

  novi() {
    if (this.role !== 'Administrator') return;
    //let obj = {
    //  naslov: "Novi Klijent",
    //  roles: this.roles,
    //  korisnik: this.repoKlijent.getNewEntity(),
    //  repo: this.repo
    //};

    //this.dialogService.open({viewModel: EditKlijent,model: obj})
    //  .then(response => {
    //    console.log(response);
    //    if (!response.wasCancelled) {
    //      console.log('not cancelled');
    //      this.datasource.read();
    //  } else {
    //    console.log('cancelled');
    //  }
    //  console.log(response.output);
    //});
    this.router.navigateToRoute("klijent", { id: 0 });
  }
  detailInit(e) {
    let detailRow = e.detailRow;
    detailRow.find('.tabstrip').kendoTabStrip({
      animation: {
        open: { effects: 'fadeIn' }
      }
    });
    this.repo.find('Nalog/NaloziPoKlijentu?klijentid=' + e.data.id)
      .then(result => {
        this.nalozi = result;
      })
      .catch(err => {
        toastr.error(err);
      });
    detailRow.find('.ponude').kendoGrid({
      dataSource: {
        pageSize: 10,
        batch: false,
        transport: {
          read: (o) => {
            this.repo.post('Ponuda/PregledGrid', o.data)
              //this.lokalep.post('Zamena/PregledGrid', o.data)                    
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
          total: "total"
        },
        filter: { field: 'klijent.id', operator: 'eq', value: e.data.id }
      },
      scrollable: false,
      sortable: true,
      pageable: true,
      columns: [
        { field: 'broj', title: 'Broj', width: '70px' },
        { field: 'datum', title: 'DatumPonude', width: '70px' },
        { field: 'valuta', title: 'Valuta', width: '30px' },
        { field: 'vrednost', title: 'Vrednost', width: '70px' }
      ]
    });
  }
}
