import { Config, Endpoint } from 'aurelia-api';
import { inject, BindingEngine, computedFrom } from 'aurelia-framework';
import { activationStrategy } from 'aurelia-router';
import { AuthService } from 'aurelia-authentication';
import { EntityManager } from 'aurelia-orm';
import 'kendo/js/kendo.dropdownlist';
import 'kendo/js/kendo.datepicker';
import 'kendo/js/kendo.numerictextbox';
import 'kendo/js/kendo.multiselect';
import { DialogService } from 'aurelia-dialog';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';
import { DataCache } from 'helper/datacache';
import { I18N } from 'aurelia-i18n';

import { Prompt } from '../../helper/prompt';


@inject(AuthService, EntityManager, AltairCommon, Endpoint.of(), Common, DialogService, Router, I18N, DataCache, Config, BindingEngine)
export class Ponuda {

  determineActivationStrategy() {
    return activationStrategy.replace; //replace the viewmodel with a new instance
    // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
    // or activationStrategy.noChange to explicitly use the default behavior
  }
  constructor(authService, em, ac, repo, common, dialogService, router, i18n, dc, config, bindingEngine) {
    this.authService = authService;
    this.repo = repo;
    this.ac = ac;
    this.dc = dc;
    this.i18n = i18n;
    this.common = common;
    this.fajlEndpoint = config.getEndpoint('fajl2');
    this.em = em;
    this.repoKontakt = em.getRepository('kontakt');
    this.dialogService = dialogService;
    this.router = router;
    this.bindingEngine = bindingEngine;
    this.obimOdabir = [];
    this.obimi = [];
    let payload = this.authService.getTokenPayload();
    if (payload) {
      this.role = payload.role;
      this.jezik = payload.Jezik;
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
    //promises.push(this.dc.dajDokumenta("Ponuda", "PonudaDokument", params.id));
    promises.push(this.repo.find('Korisnik', this.korisnikid));
    promises.push(this.dc.getObim());
    promises.push(this.repo.find("Ponuda/PonudaStavka?id=0"));
    promises.push(this.repo.find("Ponuda/PonudaPredmet?id=0"));
    if (params.idk) {
      promises.push(this.repo.find('Klijent', params.idk));
    }
    return Promise.all(promises)
      .then(res => {
        this.ponuda = res[0];
        this.klijenti = res[1];
        this.izvrsioci = res[2];
        this.rukovodioci = res[3];
        //this.ponudaDokument = res[4];
        this.korisnik = res[4];
        this.obimi = res[5];
        this.stavkamodel = res[6];
        this.predmetmodel = res[7];
        if (this.role.includes("Izvršilac") && params.id.toString() === "0") {
          this.ponuda.zaduzenZaPonudu = this.korisnik;
        }
        if (params.idk) {
          this.klijent = res[8];
          if (params.id.toString() === "0") {
            this.ponuda.klijent = this.klijent;
          }
        }
        this.ponuda.predmetPonude.forEach(e => {
          this.obimOdabir.push(e.obimPoslovanja.id);
        })
        if (this.ponuda.stavke.length === 0) {
          this.novaStavka();
        }
        //let subscription = this.be.collectionObserver(this.ponuda.predmetPonude).subscribe(this.listChanged);
        let subscription = this.bindingEngine.collectionObserver(this.ponuda.stavke).subscribe((splices) => {
          this.sumaUkupno();
        });
        this.dataSource = new kendo.data.DataSource({
          data: this.obimi,
          group: { field: "grupa" }
        });
      })
      .catch(err => {
        toastr.error(err);
      });

  }
  onChangeVazi() {
    this.ponuda.datumVazenja = new Date(moment(this.ponuda.datumPonude).add(this.ponuda.vazi, this.ponuda.vazenje === "Dan" ? "Days" : "Months"));
  }
  @computedFrom('ponuda.status')
  get lock() {
    if (this.ponuda.status >= 2 || this.ponuda.odobrenaR) {
      this.zakljucaj();
      return true;
    }
    else {
      return false;
    }
    //return this.ponuda.status >= 2 ? true : false;
  }
  @computedFrom('ponuda.vazenje', 'ponuda.vazi')
  get vazenjePonudeOpis() {
    try {
      moment.locale(this.jezik);
      return moment.duration(this.ponuda.vazi, this.ponuda.vazenje === "Dan" ? "Day" : "Month").humanize(true);

    } catch (e) {
      return "";
    }
  }
  afterAttached() {
    this.ac.altair_md.init();
    this.cboDatumVazenja.enable(false);
    this.onChangeVazi();
    this.sumaUkupno();
    if (this.ponuda.status >= 2 || this.ponuda.odobrenaR) {
      this.zakljucaj();
    };
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
    $('[name="optVazenje"]')
      .on('ifChecked', (event) => {
        this.ponuda.vazenje = event.target.id;
      });
  }
  onSelectKlijent(e) {
    let dataItem = this.cboKlijent.dataItem(e.item);
    if (dataItem.id) {
      this.ponuda.klijent = dataItem;
      this.cboKontakt.dataSource.data(this.ponuda.klijent.kontakti);
    }
    else {
      this.ponuda.klijent = null;
      this.cboKontakt.dataSource.data([]);
    }
    this.ponuda.klijentKontakt = null;
    
  }
  onSelectZaduzenZaPonudu(e) {
    let dataItem = this.cboZaduzenZaPonudu.dataItem(e.item);
    if (dataItem.id)
      this.ponuda.zaduzenZaPonudu = dataItem;
    else
      this.ponuda.zaduzenZaPonudu = null;
  }
  onSelectKontakt(e) {
    let dataItem = this.cboKontakt.dataItem(e.item);
    if (dataItem.id)
      this.ponuda.klijentKontakt = dataItem;
    else
      this.ponuda.klijentKontakt = null;
  }
  onSelectZaduzenZaProjekat(e) {
    let dataItem = this.cboZaduzenZaProjekat.dataItem(e.item);
    if (dataItem.id)
      this.ponuda.zaduzenZaProjekat = dataItem;
    else
      this.ponuda.zaduzenZaProjekat = null;
  }
  onChangeObim(event) {

    //brisem sve postojece obime
    this.ponuda.predmetPonude.forEach(e => e.obrisan = true);

    //prolazim kroz sve odabrane obime
    this.cboObim.value().forEach(e => {

      //pronalazim objekat obima
      let o = this.obimi.find(e1 => {
        return e1.id === e;
      });

      //ispituijem da li postoji selektovani obim u ponudi
      var postojeci = this.ponuda.predmetPonude.find(e => {
        return e.obimPoslovanja.id === o.id && e.obrisan;
      });

      //ako postoji, onda ponistavam da je obrisan (jer ga ima u selektovanim)
      if (postojeci)
        postojeci.obrisan = false;

      //ako ne postoji, dodajem novu stavku za predmet ponude
      if (!postojeci) {
        let pp = this.repoKontakt.getNewEntity();
        pp.setData(this.predmetmodel, true);
        pp.obimPoslovanja = o;
        this.ponuda.predmetPonude.push(pp);
      }
    })
  }
  onObimFiltering(e, dis) {
    if (e.filter) {
      var value = e.filter.value;
      var newFilter = {
        filters: [
          { field: "naziv", operator: "contains", value: value },
          { field: "sifra", operator: "contains", value: value }
        ],
        logic: "or"
      }
      e.sender.dataSource.filter(newFilter);
      e.preventDefault();
    }
    e.preventDefault();
  }
  zakljucaj() {
    if (this.cboKlijent)
      this.cboKlijent.enable(false);
    if (this.cboDatumPonude)
      this.cboDatumPonude.enable(false);
    if (this.cboZaduzenZaPonudu)
      this.cboZaduzenZaPonudu.enable(false);
    if (this.cboObim)
      this.cboObim.enable(false);
    if (this.txtPonudaVazi)
      this.txtPonudaVazi.enable(false);
  }

  intersection(o1, o2) {
    return Object.keys(o1).filter({}.hasOwnProperty.bind(o2));
  }
  odobri(res) {
    let poruka = this.i18n.tr("Da li želite da") + " " + (res ? this.i18n.tr("odobrite") : this.i18n.tr("ne odobrite")) + " " + this.i18n.tr("ponudu") + "?";

    //ponuda se ne odobrava, potreban je komentar
    if (!res) {
      let objm = {};
      objm.naslov = this.i18n.tr("Ponuda se ne odobrava - komentar");
      this.dialogService.open({ viewModel: Prompt, model: objm })
        .whenClosed(response => {
          if (!response.wasCancelled) {
            this.odobrenje(res, response.output);
          }
        });
    }
    //ponuda se odobrava
    else {
      UIkit.modal.confirm(poruka, () => {
        this.odobrenje(res);
      })
    }
  }

  odobrenje(res, komentar) {
    this.repo.post("Ponuda/Odobrenje?ishod=" + res + "&komentar=" + komentar, this.ponuda)
      .then(result => {
        if (result.success) {
          toastr.success(this.i18n.tr("Uspešno snimljeno"));
          this.ponuda = result.obj;
          this.zakljucaj();
          this.router.navigateToRoute('ponuda', { id: this.ponuda.id });
        } else {
          toastr.error(this.i18n.tr("Greška prilikom upisa"));
        }
      })
      .catch(err => {
        toastr.error(err);
      });
  }


  novaStavka() {
    let s = this.repoKontakt.getNewEntity();
    s.setData(this.stavkamodel, true);
    this.ponuda.stavke.push(s);
  }
  delete(stavka, $index) {
    stavka.obrisan = true;
  }
  onCenaChange(stavka, evt) {
    this.sumaUkupno(stavka);
  }
  onKolicinaChange(stavka, evt) {
    this.sumaUkupno(stavka);
  }

  sumaUkupno() {
    this.suma = this.ponuda.stavke.reduce((sum, stavka) => sum + (stavka.obrisan ? 0 : stavka.kolicina), 0)
    this.vrednost = this.ponuda.stavke.reduce((sum, stavka) => sum + (stavka.obrisan ? 0 : (stavka.kolicina * stavka.cena)), 0)
  }
  prihvati(res) {
    let poruka = "";
    if (res === "Da")
      poruka = this.i18n.tr("Klijent je prihvatio ponudu?");
    else if (res === "Ne")
      poruka = this.i18n.tr("Klijent nije prihvatio ponudu?");
    else {
      poruka = this.i18n.tr("Potrebna je revizija ponude?");
    }

    UIkit.modal.confirm(poruka, () => {
      this.repo.post("Ponuda/Prihvatanje?ishod=" + res, this.ponuda)
        .then(result => {
          if (result.success) {
            toastr.success(this.i18n.tr("Uspešno snimljeno"));
            this.ponuda = result.obj;
            this.zakljucaj();
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
  nalog() {
    this.router.navigateToRoute("nalog", { id: 0, idp: this.ponuda.id });
  }
  stampa() {
    this.fajlEndpoint.find("Template/", this.ponuda.id)
      .then(result => {
        console.log(1);
      })
      .catch(err => {
        toastr.error(err);
      });
  }

  snimi() {
    //validacija
    if (!this.ponuda.klijent) {
      toastr.error(this.i18n.tr("Klijent je obavezan podatak"));
      return;
    }
    if (!this.ponuda.zaduzenZaPonudu) {
      toastr.error(this.i18n.tr("Izvšilac zadužen za ponudu je obavezan podatak"));
      return;
    }
    if (this.ponuda.predmetPonude.length === 0) {
      toastr.error(this.i18n.tr("Predmet ponude je obavezan podatak"));
      return;
    }
    //if (!this.vrednost || this.vrednost === 0) {
    //  toastr.error(this.i18n.tr("Vrednost ponude je nula"));
    //  return;
    //}
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
            toastr.error(result.message);
          }
        })
        .catch(err => {
          toastr.error(err);
        });
    });
  }

}

export class LowerCaseValueConverter {
  toView(value) {
    return value.toString().toLowerCase();
  }
}
export class Datum2ValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('DD.MM.YYYY');
  }
}
export class DatumVreme2ValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('DD.MM.YYYY HH:mm:ss');
  }
}
Number.prototype.formatMoney = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
export class DinaraValueConverter {
  toView(value) {
    if (!value) return "";
    return value.formatMoney(2, ',', '.');
  }
}
export class DanValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('DD');
  }
}
export class MesecValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('MMM');
  }
}
export class GodinaValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('YY');
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
export class DatumValueConverter {
  toView(value) {
    if (!value) return "";
    moment.locale('sr');
    //return moment(value).format('LLLL');
    return moment(value).format('DD.MM.YYYY');
  }
}
