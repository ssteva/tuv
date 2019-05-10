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

@inject(AuthService, EntityManager, AltairCommon, Endpoint.of(), Common, DialogService, Router)
export class Klijenti {


  constructor(authService, em, ac, repo, common, dialogService, router) {
    this.authService = authService;
    this.repo = repo;
    this.ac = ac;
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
  }
  activate(params, routeData) {

    let promises = [];

    var p = this.repo.find('Klijent', params.id);
    promises.push(p);
    
    return Promise.all(promises)
      .then(res => {
        if (params.id !== 0)
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
        console.log(response);
        if (!response.wasCancelled) {
        } else {
          Object.assign(kontakt, orig);
          console.log('cancelled');
        }
      });
  }
  delete(kontakt, indeks) {
    UIkit.modal.confirm('Da li želite da obrišete kontakt:' + kontakt.ime + "?", () => {
      this.klijent.kontakti[indeks].obrisan = 1;
    });
  }
  novi() {
    var kontakt = this.repoKontakt.getNewEntity();
    
    var objm = {};
    objm.klijent = this.klijent;
    objm.kontakt = kontakt;
    objm.naslov = "Novi kontakt";
    
    this.dialogService.open({ viewModel: EditKontakt, model: objm })
      .whenClosed(response => {
        console.log(response);
        if (!response.wasCancelled) {
          this.klijent.kontakti.push(response.output);
        } else {
          console.log('cancelled');
        }
      });
  }
  snimi() {
    var id = this.klijent.id;
    UIkit.modal.confirm('Da li želite da sačuvate izmene?', () => {
      this.repo.update('Klijent/' + this.klijent.id, "", this.klijent)
        .then(result => {
          if (result.success) {
            toastr.success("Uspešno snimljeno");
            this.klijent = result.obj;
            if (id === 0)
              this.router.navigateToRoute('klijent', { id: this.klijent.id });
          } else {
            toastr.error("Greška prilikom upisa");
          }
        })
        .catch(err => {
          toastr.error(err);
        });
    });
  }


}
