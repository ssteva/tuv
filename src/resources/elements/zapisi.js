import { AuthService } from 'aurelia-authentication';
import { customElement, bindable, bindingMode, inject, computedFrom } from 'aurelia-framework';
import { AltairCommon } from 'helper/altair_admin_common';
import { DialogService } from 'aurelia-dialog';
import { DataCache } from 'helper/datacache';
import { Common } from 'helper/common';
import { I18N } from 'aurelia-i18n';
import { Config, Endpoint } from 'aurelia-api';
import 'kendo/js/kendo.dropdownlist';

@customElement('zapisi')
@inject(AuthService, AltairCommon, Endpoint.of(), Common, DialogService, I18N, Config, DataCache)
export class Zapisi {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) zapisi = [];
  @bindable naslov = "";
  @bindable nalogid;
  @bindable lock;

  constructor(authService, ac, repo, common, dialogService, i18n, config, dc) {
    this.authService = authService;
    this.repo = repo;
    this.fajlEndpoint = config.getEndpoint('fajl');
    this.ac = ac;
    this.dc = dc;
    this.i18n = i18n;
    this.common = common;

    this.dialogService = dialogService;

    let payload = this.authService.getTokenPayload();
    if (payload) {
      this.korisnik = payload.unique_name;
      this.role = payload.role;
    }
  }
  afterAttached() {
    this.ac.altair_md.init();
    this.reloadDocs();
  }

  reloadDocs() {
    return this.dc.dajZapise(this.nalogid)
      .then(res => {
        this.zapisi = res;

      })
      .catch(console.error);
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
    if (this.lock) {
      return;
    }
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
    var post = `Zapis?nalogid=${this.nalogid}&filename=${name}&lastmodified=${dateLastModified}&size=${size}`
    this.fajlEndpoint.post(encodeURI(post)
      , formData)
      .then(res => {
        this.reloadDocs();
        if (document.getElementById("dodaj"))
          document.getElementById("dodaj").value = "";

      })
      .catch(console.error);
  }
  delete(zapis) {
    UIkit.modal.confirm(this.i18n.tr('Da li želite da obrišete dokument?'), () => {
      this.dc.brisiZapis(zapis.id)
        .then(res => {
          this.reloadDocs();
          if (document.getElementById("dodaj"))
            document.getElementById("dodaj").value = "";

        })
        .catch(console.error);
    });
  }
  onSelectZapis(zapis, dis) {
    let dataItem = dis.dataItem;
    if (dataItem.id) {
      this.odabranizapis = dataItem;
      zapis.vrsta = this.odabranizapis.naziv;
      //zapis.oznaka = this.odabranizapis.oznaka;
    }
    else {
      this.odabranizapis = null;
      zapis.vrsta = null;
      zapis.oznaka = null;
    }
  }
  snimiZ() {
    //validacija
    var v = true;
    this.zapisi.forEach(z => {
      if (!z.vrsta) {
        v = false;
      }
    })
    if (!v) {
      toastr.error(this.i18n.tr("Morate odabrati vrstu dokumenta"));
      return;
    }
    //upis
    UIkit.modal.confirm(this.i18n.tr('Da li želite da sačuvate izmene?'), () => {
      this.repo.post('Zapis/SnimiZapise?nalogid=' + this.nalogid, this.zapisi)
        .then(result => {
          if (result.success) {
            toastr.success(this.i18n.tr("Uspešno snimljeno"));
            this.reloadDocs();
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
}

//export class LowerCaseValueConverter {
//  toView(value) {
//    return value.toString().toLowerCase();
//  }
//}
//export class DatumValueConverter {
//  toView(value) {
//    if (!value) return "";
//    moment.locale('sr');
//    //return moment(value).format('LLLL');
//    return moment(value).format('DD.MM.YYYY');
//  }
//}
export class DatumVremeFajlValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('DD.MM.YYYY HH:mm:ss');
  }
}
export class SizeValueConverter {
  toView(value) {
    var bytes = value;
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(0) + " MB";
    else return (bytes / 1073741824).toFixed(0) + " GB";

  }
}
//export class DinaraValueConverter {
//  toView(value) {
//    if (!value) return "";
//    return value.formatMoney(2, '.', ',');
//  }
//}
