import { AuthService } from 'aurelia-authentication';
import { customElement, bindable, bindingMode, inject, computedFrom } from 'aurelia-framework';
import { AltairCommon } from 'helper/altair_admin_common';
import { DialogService } from 'aurelia-dialog';
import { DataCache } from 'helper/datacache';
import { Common } from 'helper/common';
import { I18N } from 'aurelia-i18n';
import { Config, Endpoint } from 'aurelia-api';

@customElement('fajlovi')
@inject(AuthService, AltairCommon, Endpoint.of(), Common, DialogService, I18N, Config, DataCache)
export class Fajlovi {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) fajlovi = [];
  @bindable naslov = "dfdsfsd";
  @bindable maksimum = 1;
  @bindable entitet;
  @bindable entitetopis;
  @bindable entitetid;

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
    return this.dc.dajDokumenta(this.entitet, this.entitetopis, this.entitetid)
      .then(res => {
        this.fajlovi = res;

      })
      .catch(console.error);
  }
  fileSelected(event) {
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
    var post = `Dokument?entitet=${this.entitet}&entitetid=${this.entitetid}&entitetopis=${this.entitetopis}&filename=${name}&lastmodified=${dateLastModified}&size=${size}`
    this.fajlEndpoint.post(encodeURI(post)
      , formData)
      .then(res => {
        this.reloadDocs();
        if (document.getElementById("dodaj"))
          document.getElementById("dodaj").value = "";
        
      })
      .catch(console.error);
  }
  deletePonudaDokument(id) {
    UIkit.modal.confirm(this.i18n.tr('Da li želite da obrišete dokument?'), () => {
      this.dc.brisiDokument(id)
        .then(res => {
          this.reloadDocs();
          if (document.getElementById("dodaj"))
            document.getElementById("dodaj").value = "";
          
        })
        .catch(console.error);
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
//    return value.formatMoney(2, ',', '.');
//  }
//}
