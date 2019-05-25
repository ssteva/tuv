import { Endpoint } from 'aurelia-api';
import { inject } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { EntityManager } from 'aurelia-orm';
import { EditKontakt } from './editkontakt'
import 'kendo/js/kendo.grid';
import 'kendo/js/kendo.dropdownlist';
import { DialogService } from 'aurelia-dialog';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

@inject(AuthService, EntityManager, AltairCommon, Endpoint.of(), Common, DialogService, Router, I18N)
export class Klijenti {


  constructor(authService, em, ac, repo, common, dialogService, router, i18n) {
    this.authService = authService;
    this.repo = repo;
    this.ac = ac;
    this.i18n = i18n;
    this.common = common;
    this.em = em;
    this.dialogService = dialogService;
    this.repoKlijent = em.getRepository('klijent');
    this.repoKontakt = em.getRepository('kontakt');
    this.router = router;
    let payload = this.authService.getTokenPayload();
    if (payload) {
      this.korisnik = payload.unique_name;
      this.role = payload.role;
    }

    this.dsPonude = new kendo.data.DataSource({
      pageSize: 10,
      batch: false,
      transport: {
        read: (o) => {
          let vrsta = false;
          if (o.data.filter) {
            o.data.filter.filters.forEach(f => {
              if (f.field === 'klijent.id') vrsta = true;
            });
            if (vrsta === false) {
              o.data.filter.filters.push({ field: "klijent.id", operator: "equals", value: this.klijent.id });
            }
          } else {
            o.data.filter = { logic: "and", filters: [] };
            o.data.filter.filters.push({ field: "klijent.id", operator: "equals", value: this.klijent.id });
          }
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
  activate(params, routeData) {

    let promises = [];

    var p = this.repo.find('Klijent', params.id);
    promises.push(p);
    
    return Promise.all(promises)
      .then(res => {
        if (params.id.toString() !== "0")
          this.klijent = res[0];
      })
      .catch(err => {
        toastr.error(err.statusText);
      });

  }
  edit(kontakt, indeks) {
    var objm = {};
    objm.klijent = this.klijent;
    objm.kontakt = kontakt;
    objm.naslov = kontakt.ime;

    let tmp = this.repoKontakt.getNewEntity();
    tmp.setData(kontakt, true);
    let orig = tmp.asObject();

    this.dialogService.open({ viewModel: EditKontakt, model: objm })
      .whenClosed(response => {
        if (!response.wasCancelled) {
        } else {
          Object.assign(kontakt, orig);
        }
      });
  }
  delete(kontakt, indeks) {
    UIkit.modal.confirm(this.i18n.tr("Da li želite da obrišete kontakt") + ": " + kontakt.ime + "?", () => {
      this.klijent.kontakti[indeks].obrisan = 1;
    });
  }
  novi() {
    var kontakt = this.repoKontakt.getNewEntity();
    
    var objm = {};
    objm.klijent = this.klijent;
    objm.kontakt = kontakt;
    objm.naslov = this.i18n.tr("Novi kontakt");
    
    this.dialogService.open({ viewModel: EditKontakt, model: objm })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.klijent.kontakti.push(response.output);
        }
      });
  }
  snimi() {
    var id = this.klijent.id;
    UIkit.modal.confirm(this.i18n.tr('Da li želite da sačuvate izmene?'), () => {
      this.repo.update('Klijent/' + this.klijent.id, "", this.klijent)
        .then(result => {
          if (result.success) {
            toastr.success(this.i18n.tr("Uspešno snimljeno"));
            this.klijent = result.obj;
            if (id === 0)
              this.router.navigateToRoute('klijent', { id: this.klijent.id });
          } else {
            toastr.error(this.i18n.tr("Greška prilikom upisa"));
          }
        })
        .catch(err => {
          toastr.error(err);
        });
    });
  }



  izmena(obj, e) {
    if (this.role !== 'Administrator') return;
    this.router.navigateToRoute("ponuda", { id: obj.id, idk: this.klijent.id });
  }

  novi() {
    this.router.navigateToRoute("ponuda", { id: 0, idk: this.klijent.id });
  }

}
