import {Endpoint} from 'aurelia-api';
import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';
import {EntityManager} from 'aurelia-orm';
import 'kendo/js/kendo.grid';
import 'kendo/js/kendo.dropdownlist';
import * as toastr from 'toastr';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';

@inject(AuthService, EntityManager, AltairCommon,  Endpoint.of(), Common, Router)
export class Ponude {
  

  constructor(authService, em, ac,  repo, common, router) {
    this.authService = authService;
    this.repo = repo;
    //this.repoKorisnik = em.getRepository('korisnik');
    this.ac = ac;
    this.common = common;
    this.router = router;
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
            datumPonude: { type: 'date' }
          //  ime: { type: 'string' },
          //  prezime: { type: 'string' },
          //  email: { type: 'string' },
          //  uloga: { type: 'string' }
          }
        }
      }
    });
  }
  izmena(obj, e) {
    if (this.role !== 'Administrator') return;
    this.router.navigateToRoute("ponuda", { id: obj.id });
  }

  novi() {
    this.router.navigateToRoute("ponuda", { id: 0 });
  }
}
