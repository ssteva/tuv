import { inject } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
import { AuthService } from 'aurelia-authentication';
import { AltairCommon } from 'helper/altair_admin_common';
import 'kendo/js/kendo.dropdownlist';
import { I18N } from 'aurelia-i18n';

@inject(DialogController, DialogService, AuthService, AltairCommon, I18N)
export class EditObim {
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
    this.obj = obj
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
    this.obj.obj.obrisan = !this.obj.obrisan;
  }
  cancel() {
    this.dialogController.cancel();
  }
  potvrdi() {
    UIkit.modal.confirm(this.i18n.tr('Da li želite da sačuvate izmene?'), () => {
      this.dialogController.ok(this.obj);
    });
  }

}
