import { Endpoint } from 'aurelia-api';
import { inject } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { EntityManager } from 'aurelia-orm';
import 'kendo/js/kendo.dropdownlist';
import 'kendo/js/kendo.datepicker';
import 'kendo/js/kendo.numerictextbox';
import { DialogService } from 'aurelia-dialog';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';
import { DataCache } from 'helper/datacache';
import { I18N } from 'aurelia-i18n';
import { Config } from 'aurelia-api';

@inject(AuthService, EntityManager, AltairCommon, Endpoint.of(), Common, DialogService, Router, I18N, DataCache, Config)
export class Ponuda {


  constructor(authService, em, ac, repo, common, dialogService, router, i18n, dc, config) {
    this.authService = authService;
    this.repo = repo;
    this.ac = ac;
    this.dc = dc;
    this.i18n = i18n;
    this.common = common;
    this.fajlEndpoint = config.getEndpoint('fajl');
    this.em = em;
    this.dialogService = dialogService;
    this.router = router;
    let payload = this.authService.getTokenPayload();
    if (payload) {
      this.role = payload.role;
      //this.korisnikid = payload.nameid
      if (Array.isArray(payload.unique_name))
        this.korisnikid = payload.unique_name[0];
      else
        this.korisnikid = payload.unique_name;
    }
  }
  activate(params, routeData) {

    let promises = [];

    var p = this.repo.find('Ponuda', params.id);
    promises.push(p, this.dc.dajSveKlijente(), this.dc.dajIzvrsioce(), this.dc.dajRukovodioce());
    promises.push(this.dc.dajDokumenta("Ponuda", "PonudaDokument", params.id));
    promises.push(this.repo.find('Korisnik', this.korisnikid));
    if (params.idk) {
      promises.push(this.repo.find('Klijent', params.idk));
    }
    return Promise.all(promises)
      .then(res => {
        this.ponuda = res[0];
        this.klijenti = res[1];
        this.izvrsioci = res[2];
        this.rukovodioci = res[3];
        this.ponudaDokument = res[4];
        this.korisnik = res[5];
        if (this.role.includes("Izvršilac") && params.id.toString() === "0") {
          this.ponuda.korisnik = this.korisnik;
        }
        if (params.idk) {
          this.klijent = res[6];
          if (params.id.toString() === "0") {
            this.ponuda.klijent = this.klijent;
            if (this.role.includes("Izvršilac")) {
              this.ponuda.korisnik = this.korisnik;
            }
          }
        }
      })
      .catch(err => {
        toastr.error(err);
      });
  }

  reloadDocs() {
    let promises = [];
    promises.push(this.dc.dajDokumenta("Ponuda", "PonudaDokument", this.ponuda.id));
    return Promise.all(promises)
      .then(res => {
        this.ponudaDokument = res[0];
      })
      .catch(err => {
        toastr.error(err.statusText);
      });
  }

  afterAttached() {
    this.ac.altair_md.init();
    $('[name="optValuta"]')
      .on('ifChecked', (event) => {
        this.ponuda.valuta = event.target.id;
      });
    $('[name="optPonudaPrihvacena"]')
      .on('ifChecked', (event) => {
        if (event.target.id === 'da') {
          this.ponuda.prihvacena = true;
        } else {
          this.ponuda.prihvacena = false;
        }
      });
  }
  onSelectKlijent(e) {
    let dataItem = this.cboKlijent.dataItem(e.item);
    if (dataItem.id)
      this.ponuda.klijent = dataItem;
    else
      this.ponuda.klijent = null;
  }
  onSelectZaduzenZaPonudu(e) {
    let dataItem = this.cboZaduzenZaPonudu.dataItem(e.item);
    if (dataItem.id)
      this.ponuda.zaduzenZaPonudu = dataItem;
    else
      this.ponuda.zaduzenZaPonudu = null;
  }
  onSelectZaduzenZaProjekat(e) {
    let dataItem = this.cboZaduzenZaProjekat.dataItem(e.item);
    if (dataItem.id)
      this.ponuda.zaduzenZaProjekat = dataItem;
    else
      this.ponuda.zaduzenZaProjekat = null;
  }
  fileSelectedPonudaDokument(event) {
    //let reader = new FileReader();
    let file = event.target.files[0];
    var name = file.name,
      size = file.size,
      type = file.type,
      dateLastModified = new Date(file.lastModified).toJSON();
    var formData = new FormData();


    formData.append("file", file);
    formData.append('fileName', name);
    formData.append('dateLastModified', name);

    this.fajlEndpoint.post("Dokument?entitet=Ponuda&entitetid=" + this.ponuda.id + "&entitetopis=PonudaDokument&filename=" + name + "&lastmodified=" + dateLastModified + "&size=" + size
      , formData)
      .then(res => {
        document.getElementById("ponudaDokument").value = "";
        this.reloadDocs();
      })
      .catch(console.error);


    //reader.readAsDataURL(file);
    //this.fileName = file.name;
    //reader.onload = () => {
    //  let fajl = reader.result;
    //};
  }
  deletePonudaDokument(id) {
    UIkit.modal.confirm(this.i18n.tr('Da li želite da obrišete dokument?'), () => {
      this.dc.brisiDokument(id)
        .then(res => {
          this.reloadDocs();
        })
        .catch(console.error);
    });
  }

  snimi() {
    //validacija
    if (!this.ponuda.klijent) {
      toastr.error(this.i18n.tr("Klijent je obavezan podatak"));
      return;
    }

    //upis
    var id = this.ponuda.id;
    UIkit.modal.confirm(this.i18n.tr('Da li želite da sačuvate izmene?'), () => {
      this.repo.update('Ponuda/' + this.ponuda.id, "", this.ponuda)
        .then(result => {
          if (result.success) {
            toastr.success(this.i18n.tr("Uspešno snimljeno"));
            this.ponuda = result.obj;
            if (id === 0)
              this.router.navigateToRoute('ponuda', { id: this.ponuda.id });
          } else {
            toastr.error(this.i18n.tr("Greška prilikom upisa"));
          }
        })
        .catch(err => {
          toastr.error(err);
        });
    });
  }

}
var simulateSleep = function (milliseconds) {
  var date = new Date();
  var currentDate = null;
  do { currentDate = new Date(); }
  while (currentDate - date < milliseconds);
}

export class LowerCaseValueConverter {
  toView(value) {
    return value.toString().toLowerCase();
  }
}
export class DatumValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('DD.MM.YYYY');
  }
}
export class DatumVremeValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('DD.MM.YYYY HH:mm:ss');
  }
}
export class DinaraValueConverter {
  toView(value) {
    if (!value) return "";
    return value.formatMoney(2, '.', ',');
  }
}
