import { inject } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
//import { AuthService } from 'aurelia-authentication';
import { AltairCommon } from 'helper/altair_admin_common';
import { I18N } from 'aurelia-i18n';
import { setTimeout } from 'timers';


@inject(DialogController, DialogService, AltairCommon, I18N)
export class EditFinansije {
    constructor(dialogController, dialogService, ac, i18n) {
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
    activate(objekat) {

        this.naslov = objekat.naslov;
        this.obj = objekat.finansije;
        this.new = objekat.new;
        this.vrsta = objekat.vrsta;
        this.valuta = objekat.valuta;
        //if (!this.obj.valuta) {
        this.obj.valuta = objekat.valuta;
        //}
        if (objekat.new) {
          this.obj.datum = new Date();
        }
        //this.roles = obj.roles;
        //this.repo = obj.repo;
        //if (!this.korisnik) {
        //    this.korisnik = this.repoKorisnik.getPopulatedEntity(korisnik);
        //} else {
        //    this.korisnik = this.repoKorisnik.getNewEntity();
        //}
        //console.log(this.korisnik);
    }
    attached() {
        this.ac.altair_md.init();
        $('[name="optValuta"]')
            .on('ifChecked', (event) => {
                this.obj.valuta = event.target.id;
            });
    }
    onChange(obj) {
        
    }
    obrisan(dis) {
        //console.log(dis.korisnik.obrisan);
        //this.korisnik.obrisan = !this.korisnik.obrisan;

    }
    cancel() {
        this.dialogController.cancel();
    }

    snimi() {
        if (!this.obj.valuta) {
            toastr.error(this.i18n.tr('Valuta je obavezan unos'));
            return;
        }
        UIkit.modal.confirm(this.i18n.tr('Da li želite da sačuvate izmene?'), () => {
            this.dialogController.ok(this.obj);
        });
        
    }
}
