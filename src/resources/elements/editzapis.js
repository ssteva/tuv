import { inject } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
import { AuthService } from 'aurelia-authentication';
import { AltairCommon } from 'helper/altair_admin_common';
import { Common } from 'helper/common';
import { I18N } from 'aurelia-i18n';

@inject(DialogController, DialogService, AltairCommon, Common, I18N, AuthService)
export class EditZapis {
    constructor(dialogController, dialogService, ac, common, i18n, authService) {
        this.dialogController = dialogController;
        this.dialogService = dialogService;
        this.ac = ac;
        this.common = common;
        this.i18n = i18n;
         this.authService = authService;
         let payload = this.authService.getTokenPayload();
         this.korisnik = payload.unique_name;
         if (payload)
             this.role = payload.role;
    }
    activate(objekat) {

        this.naslov = objekat.naslov;
        this.obj = objekat.zapis;
        this.nalog = objekat.nalog;
        this.new = objekat.new;
        this.fajlEndpoint = objekat.fajlEndpoint;
        this.repo = objekat.repo;
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
        setInterval(() => {
            this.ac.altair_md.init();
        }, 1000);
        
    }
    onChange(obj) {

    }
    onSelectZapis(zapis, dis) {
        let dataItem = dis.dataItem;
        if (dataItem.id) {
            this.odabranizapis = dataItem;
            this.obj.vrsta = this.odabranizapis.naziv;
            //zapis.oznaka = this.odabranizapis.oznaka;
        }
        else {
            this.odabranizapis = null;
            this.obj.vrsta = null;
            this.obj.oznaka = null;
        }
    }
    obrisan(dis) {
        //console.log(dis.korisnik.obrisan);
        //this.korisnik.obrisan = !this.korisnik.obrisan;

    }
    cancel() {
        this.dialogController.cancel();
    }

    snimi() {
        UIkit.modal.confirm(this.i18n.tr('Da li želite da sačuvate izmene?'), () => {
            this.repo.post('Zapis/Snimi?nalogid=' + this.nalog.id, this.obj)
                .then(result => {
                    if (result.success) {
                        toastr.success(this.i18n.tr("Uspešno snimljeno"));
                        this.obj = result.objekat;
                        this.dialogController.ok(this.obj);
                    } else {
                        toastr.error(this.i18n.tr("Greška prilikom upisa"));
                        toastr.error(result.message);
                    }
                })
                .catch(err => {
                    toastr.error(err);
                });
        });
    }

    rezervisi() {
        //validacija
        if (!this.obj.vrsta) {
            toastr.error(this.i18n.tr("Morate odabrati vrstu dokumenta"));
            return;
        }
        this.snimi();
    }

    fileSelected(event) {

        //validacija
        //var v = true;
        //this.zapisi.forEach(z => {
        //  if (!z.vrsta) {
        //    v = false;
        //  }
        //})
        //if (!v) {
        //  toastr.error(this.i18n.tr("Morate odabrati vrstu dokumenta"));
        //  if (document.getElementById("dodaj"))
        //    document.getElementById("dodaj").value = "";
        //  return;
        //}
        //if (this.role !== "Rukovodilac" && (this.obj.fileName === null || this.obj.fileName === undefined || this.obj.fileName === "") {
        //    toastr.error(this.i18n.tr("Nemate prava na zamenu dokumenta"));
        //    if (document.getElementById("dodaj")) {
        //        document.getElementById("dodaj").value = "";
        //    }
        //    return;
        //}
        //let reader = new FileReader();
        let file = event.target.files[0];
        var name = file.name,
            size = file.size,
            type = file.type,
            dateLastModified = new Date(file.lastModified).toJSON();

        var formData = new FormData();


        formData.append("file", file);
        //formData.append('fileName', name);
        //formData.append('dateLastModified', name);
        var post = `Zapis?zapisid=${this.obj.id}&filename=${name}&lastmodified=${dateLastModified}&size=${size}`
        this.fajlEndpoint.post(encodeURI(post)
            , formData)
            .then(result => {
                if (document.getElementById("dodaj"))
                    document.getElementById("dodaj").value = "";
                if (result.success) {
                    this.obj = result.objekat;
                    this.dialogController.ok(this.obj);
                }


            })
            .catch(console.error);
    }
}
