import {Endpoint} from 'aurelia-api';
import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';
import {EntityManager} from 'aurelia-orm';
import {DialogService} from 'aurelia-dialog';
import {EditKorisnik} from './editkorisnik'
import 'kendo/js/kendo.grid';
import 'kendo/js/kendo.dropdownlist';
import * as toastr from 'toastr';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { I18N } from 'aurelia-i18n';

@inject(AuthService, EntityManager, AltairCommon, DialogService, Endpoint.of(), Common, I18N)
export class Korisnici {
  

  constructor(authService, em, ac, dialogService, repo, common, i18n) {
    this.authService = authService;
    this.repo = repo;
    //this.repoKorisnik = em.getRepository('korisnik');
    this.ac = ac;
    this.dialogService = dialogService;
    this.common = common;
    this.i18n = i18n;
    this.repoKorisnik = em.getRepository('korisnik');
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
          this.repo.find('Korisnik/ListaKorisnika', o.data)
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
    });
  }
  izmena(obj, e) {
    // obj.edit = true;
    // this.grid.refresh();
    let objm = {
      naslov: `${obj.ime} ${obj.prezime}`,
      roles: this.common.roles,
      korisnik: obj,
      repo: this.repo
    };

    this.dialogService.open({viewModel: EditKorisnik, model: objm})
      .whenClosed(response => {
        
        if (!response.wasCancelled) {
          
          this.datasource.read();
      } else {
        
      }
    });
  }
  izmeniInline(obj, e) {
    obj.edit = true;
    this.grid.refresh();
  }
  potvrdi(obj, e) {
    if (confirm(this.i18n.tr("Da li želite da sačuvate izmene?"))) {
      this.repo.post('Korisnik', obj)
        .then(res => {
          toastr.success("Uspešno snimljeno");
          this.grid.dataSource.read();
        })
        .error(err => toastr.error(err.statusText));
    }
  }
  otkazi(obj, e) {
    this.grid.dataSource.read();
  }
  noviKorisnik() {
    if (this.role !== 'Administrator') return;
    let obj = {
      naslov: this.i18n.tr("Novi korisnik"),
      roles: this.common.roles,
      korisnik: this.repoKorisnik.getNewEntity(),
      repo: this.repo
    };

    this.dialogService.open({viewModel: EditKorisnik,model: obj})
      .then(response => {
        
        if (!response.wasCancelled) {
          
          this.datasource.read();
      } else {
        
      }
      
    });
  }
}
