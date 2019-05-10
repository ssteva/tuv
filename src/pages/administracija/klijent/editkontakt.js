import { inject } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
//import { AuthService } from 'aurelia-authentication';
import { AltairCommon } from 'helper/altair_admin_common';


@inject(DialogController, DialogService,  AltairCommon)
export class EditKontakt {
  constructor(dialogController, dialogService,  ac) {
    this.dialogController = dialogController;
    this.dialogService = dialogService;
    this.ac = ac;
    // this.authService = authService;
    // let payload = this.authService.getTokenPayload();
    // this.korisnik = payload.unique_name;
    // if (payload)
    //     this.role = payload.role;
  }
  activate(obj) {
  
    this.naslov = obj.naslov;
    this.klijent = obj.klijent;
    this.kontakt = obj.kontakt;
    this.roles = obj.roles;
    this.repo = obj.repo;
    //if (!this.korisnik) {
    //    this.korisnik = this.repoKorisnik.getPopulatedEntity(korisnik);
    //} else {
    //    this.korisnik = this.repoKorisnik.getNewEntity();
    //}
    //console.log(this.korisnik);
  }
  attached() {
    this.ac.altair_md.init();
  }
  obrisan(dis) {
    //console.log(dis.korisnik.obrisan);
    //this.korisnik.obrisan = !this.korisnik.obrisan;

  }
  cancel() {
    this.dialogController.cancel();
  }

  potvrdi() {
    this.dialogController.ok(this.kontakt);
  }
}
