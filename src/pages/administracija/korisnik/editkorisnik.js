import { inject } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
import { AuthService } from 'aurelia-authentication';
import { AltairCommon } from 'helper/altair_admin_common';
import 'kendo/js/kendo.dropdownlist';
import { I18N } from 'aurelia-i18n';

@inject(DialogController, DialogService, AuthService, AltairCommon, I18N)
export class EditKorisnik {
  constructor(dialogController, dialogService, authService, ac, i18n) {
    this.dialogController = dialogController;
    this.dialogService = dialogService;
    this.ac = ac;
    this.i18n = i18n;
    // this.authService = authService;
    // let payload = this.authService.getTokenPayload();
    // this.korisnik = payload.unique_name;
    // if (payload)
    //     this.role = payload.role;
  }
  activate(obj) {
    this.naslov = obj.naslov;
    this.korisnik = obj.korisnik;
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
    this.korisnik.obrisan = !this.korisnik.obrisan;
  }
  cancel() {
    this.dialogController.cancel();
  }
  resetLozinke() {
    UIkit.modal.confirm(this.i18n.tr("Da li želite da se resetujete loziku za korisnika") + " " + this.korisnik.email + "?", () => {
      this.repo.post("Korisnik/ResetLozinke", this.korisnik)
        .then(result => {
          toastr.info(this.i18n.tr("Nova lozinka je") + " " + this.korisnik.korisnickoIme);
        });
    });
  }
  potvrdi() {
    if (!this.korisnik.email) {
      toastr.error(this.i18n.tr("Email je obavezan unos"));
      return;
    }
    UIkit.modal.confirm(this.i18n.tr("Da li želite da sačuvate izmene?"), () => {
      this.repo.post('Korisnik', this.korisnik)
        .then(res => {
          toastr.success(this.i18n.tr("Uspešno snimljeno"));
          this.dialogController.ok();
        })
        .catch(err => {
          toastr.error(err);
        });
    });
  }


}
