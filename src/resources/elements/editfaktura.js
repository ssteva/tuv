import { inject } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
//import { AuthService } from 'aurelia-authentication';
import { AltairCommon } from 'helper/altair_admin_common';


@inject(DialogController, DialogService, AltairCommon)
export class EditFaktura {
    constructor(dialogController, dialogService, ac) {
        this.dialogController = dialogController;
        this.dialogService = dialogService;
        this.ac = ac;
        // this.authService = authService;
        // let payload = this.authService.getTokenPayload();
        // this.korisnik = payload.unique_name;
        // if (payload)
        //     this.role = payload.role;
    }
    activate(objekat) {

        this.naslov = objekat.naslov;
        this.obj = objekat.faktura;
        this.new = objekat.new;
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

        this.dialogController.ok(this.obj);
    }
}
