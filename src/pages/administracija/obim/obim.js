import { Endpoint } from 'aurelia-api';
import { inject } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { EntityManager } from 'aurelia-orm';
import 'kendo/js/kendo.dropdownlist';
import { DataCache } from 'helper/datacache';
import { DialogService } from 'aurelia-dialog';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';
import { EditObim } from './editobim';
import { I18N } from 'aurelia-i18n';

@inject(AuthService, EntityManager, AltairCommon, Endpoint.of(), Common, Router, DataCache, DialogService, I18N)
export class Obim {


  constructor(authService, em, ac, repo, common, router, dataCache, dialogService, i18n) {
    this.authService = authService;
    this.repo = repo;
    this.em = em;
    this.repoPrimarna = em.getRepository('primarna');
    this.repoSekundarna = em.getRepository('sekundarna');
    this.repoTercijarna = em.getRepository('tercijarna');
    this.repoObim = em.getRepository('obim');
    this.ac = ac;
    this.dc = dataCache;
    this.common = common;
    this.router = router;
    this.dialogService = dialogService;
    this.i18n = i18n;
    let payload = this.authService.getTokenPayload();
    if (payload) {
      this.korisnik = payload.unique_name;
      this.role = payload.role;
    }
    this.primarna = null;
    this.odabranesekundarne = [];
    this.odabranetercijarne = [];
    this.odabraniobimi = [];
  }
  activate() {
    return this.reload();
  }
  reload(forcedb) {
    let promises = [];

    promises.push(this.dc.getPrimarna(forcedb));
    promises.push(this.dc.getSekundarna(forcedb));
    promises.push(this.dc.getTercijarna(forcedb));
    promises.push(this.dc.getObim(forcedb));

    return Promise.all(promises)
      .then(res => {
        this.primarne = res[0];
        this.sekundarne = res[1];
        this.tercijarne = res[2];
        this.obimi = res[3];
        this.refresh();
      })
      .catch(err => {
        toastr.error(err.statusText ? err.statusText : err);
      });
  }
  dajObjekat(id, tip) {
    var obj;
    if (!id) return null;
    if (tip === "Primarna") {
      obj = this.primarne.find(e => {
        return e.id === id;
      });
    }

    if (tip === "Sekundarna") {
      obj = this.sekundarne.find(e => {
        return e.id === id;
      });
    }
    if (tip === "Tercijarna") {
      obj = this.tercijarne.find(e => {
        return e.id === id;
      });
    }
    if (tip === "Obim") {
      obj = this.obimi.find(e => {
        return e.id === id;
      });
    }
    return obj;
  }

  dajTekucuPoziciju(tip) {
    if (tip === "Primarna") {
      return this.dajObjekat(this.primarna, "Primarna").sifra.toString().substr(0, 1);
    }
    if (tip === "Sekundarna") {
      let obj = this.dajObjekat(this.sekundarna, "Sekundarna");
      if (obj) {
        return obj.sifra.toString().substr(1, 1);
      }
      return "0";
    }
    if (tip === "Tercijarna") {
      let obj = this.dajObjekat(this.tercijarna, "Tercijarna");
      if (obj) {
        return obj.sifra.toString().substr(2, 1);
      }
      return "0";
    }
    if (tip === "Obim") {
      let obj = this.dajObjekat(this.obim, "Obim");
      if (obj) {
        return obj.sifra.toString().substr(3, 1);
      }
      return "0";
    }
  }

  dajPredlogSifre(tip) {
    let sifra;
    try {
      if (tip === "Primarna") {
        sifra = this.primarne[this.primarne.length - 1].sifra;
        return Number(sifra) + 1000;
      }
      if (tip === "Sekundarna") {
        let jedans = this.dajTekucuPoziciju("Primarna");
        let dva = this.dajTekucuPoziciju("Sekundarna");

        let sekundarnefilter = this.sekundarne.filter(e => {
          return e.primarna.id === this.primarna;
        })
        if (sekundarnefilter.length !== 0) {
          let s = sekundarnefilter[sekundarnefilter.length - 1];
          sifra = Number(s.sifra) + 100;
        } else {
          sifra = (jedans + 100).toString();
        }
      }
      if (tip === "Tercijarna") {
        let jedant = this.dajTekucuPoziciju("Primarna");
        // default za sekundarnu
        let dvaT = this.dajTekucuPoziciju("Sekundarna")



        let tercijarnefilter = this.tercijarne.filter(e => {
          return e.primarna.id === this.primarna && (e.sekundarna ? e.sekundarna.id : -1) === this.sekundarna;
        })
        if (tercijarnefilter.length !== 0) {
          let s = tercijarnefilter[tercijarnefilter.length - 1];
          sifra = Number(s.sifra) + 10;
        } else {
          sifra = (jedant + dvaT + 10).toString();
        }
      }
      if (tip === "Obim") {
        let jedano = this.dajTekucuPoziciju("Primarna");
        // default za sekundarnu
        let dvaO = this.dajTekucuPoziciju("Sekundarna");
        let triO = this.dajTekucuPoziciju("Tercijarna");


        let obimifilter = this.obimi.filter(e => {
          if(this.sekundarna && this.tercijarna)
            return e.primarna.id === this.primarna && e.sekundarna.id === this.sekundarna && e.tercijarna.id === this.tercijarna;
          if (!this.sekundarna && this.tercijarna)
            return e.primarna.id === this.primarna && !e.sekundarna && e.tercijarna.id === this.tercijarna;
          if (this.sekundarna && !this.tercijarna)
            return e.primarna.id === this.primarna && e.sekundarna.id  === this.sekundarna && !e.tercijarna;
          if (!this.sekundarna && !this.tercijarna)
            return e.primarna.id === this.primarna && !e.sekundarna  && !e.tercijarna;
        });
        if (obimifilter.length !== 0) {
          let s = obimifilter[obimifilter.length - 1];
          sifra = Number(s.sifra) + 1;
        } else {
          sifra = (jedano + dvaO + triO + 1).toString();
        }
      }

      return sifra.toString();
    } catch (e) {
      return "";
    }
    

  }

  chgPrimarna(primarna) {
    this.odabranesekundarne = this.sekundarne.filter(e => {
      return e.primarna.id === primarna;
    })
    this.chgSekundarna(this.sekundarna);
    this.chgTercijarna(this.tercijarna);
  }

  chgSekundarna(sekundarna) {
    this.odabranetercijarne = this.tercijarne.filter(e => {
      if (this.sekundarna)
        return (e.sekundarna ? e.sekundarna.id : -1) === sekundarna && e.primarna.id === this.primarna;
      if (!this.sekundarna)
        return !e.sekundarna  && e.primarna.id === this.primarna;
    })
    this.chgTercijarna(this.tercijarna);
  }

  chgTercijarna(tercijarna) {
    this.odabraniobimi = this.obimi.filter(e => {
      if (this.sekundarna && this.tercijarna)
        return e.primarna.id === this.primarna && (e.sekundarna ? e.sekundarna.id : -1) === this.sekundarna && (e.tercijarna ? e.tercijarna.id : -1) === tercijarna;

      if (!this.sekundarna && this.tercijarna)
        return e.primarna.id === this.primarna && (e.tercijarna ? e.tercijarna.id : -1) === tercijarna && !e.sekundarna;

      if (this.sekundarna && !this.tercijarna)
        return e.primarna.id === this.primarna && (e.sekundarna ? e.sekundarna.id : -1) === this.sekundarna && !e.tercijarna;

      if (this.primarna && !this.sekundarna && !this.tercijarna)
        return e.primarna.id === this.primarna && !e.sekundarna && !e.tercijarna;
    })
  }
  chgObim(obim) {

  }

  novaPrimarna() {
    //toastr.info(this.dajPredlogSifre("Primarna"));
    let obj2 = this.repoPrimarna.getNewEntity();

    obj2.id = 0;
    obj2.sifra = this.dajPredlogSifre("Primarna");
    let obj = {
      naslov: this.i18n.tr("Nova primarna grupa"),
      tip: "Primarna",
      obj: obj2,
      edit: false,
      repo: this.repo
    };
    this.dialogService.open({ viewModel: EditObim, model: obj })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          //this.primarne.push(response.output.obj);
          this.snimi("Primarna", response.output.obj);
        } else {
          
        }
      });
  }
  izmenaPrimarna() {
    let obj2 = this.dajObjekat(this.primarna, "Primarna");
    let obj = {
      naslov: `${obj2.sifra} - ${obj2.naziv}`,
      tip: "Primarna",
      obj: obj2,
      edit: true,
      repo: this.repo
    };

    let tmp = this.repoPrimarna.getNewEntity();
    tmp.setData(obj2, true);
    let orig = tmp.asObject();

    this.dialogService.open({ viewModel: EditObim, model: obj })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.snimi("Primarna", response.output.obj);
        } else {
          Object.assign(obj2, orig);
        }
      });
  }


  delPrimarna() {
    let obj = this.dajObjekat(this.primarna, "Primarna");
    UIkit.modal.confirm(this.i18n.tr("Da li želite da obrišete primarnu grupu") + ": " + `${obj.sifra} - ${obj.naziv}` + "?", () => {
      this.obrisi("Primarna", obj.id);
      //obj.obrisan = true;
      //let ind = this.primarne.indexOf(obj);
      //this.primarne.splice(ind, 1);
      //this.primarne.forEach(e => {
      //  if (e.primarna.id === this.primarna) {

      //  }
      //})
    });
  }
  novaSekundarna() {
    //toastr.info(this.dajPredlogSifre("Primarna"));
    let obj2 = this.repoSekundarna.getNewEntity();

    obj2.id = 0;
    obj2.sifra = this.dajPredlogSifre("Sekundarna");
    obj2.primarna = this.dajObjekat(this.primarna, "Primarna");
    let obj = {
      naslov: this.i18n.tr("Nova sekundarna grupa"),
      tip: "Sekundarna",
      obj: obj2,
      edit: false,
      repo: this.repo
    };
    this.dialogService.open({ viewModel: EditObim, model: obj })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          //this.primarne.push(response.output.obj);
          this.snimi("Sekundarna", response.output.obj);
        } else {

        }
      });
  }
  izmenaSekundarna() {
    let obj2 = this.dajObjekat(this.sekundarna, "Sekundarna");
    let obj = {
      naslov: `${obj2.sifra} - ${obj2.naziv}`,
      tip: "Sekundarna",
      obj: obj2,
      edit: true,
      repo: this.repo
    };

    let tmp = this.repoSekundarna.getNewEntity();
    tmp.setData(obj2, true);
    let orig = tmp.asObject();

    this.dialogService.open({ viewModel: EditObim, model: obj })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.snimi("Sekundarna", response.output.obj);
        } else {
          Object.assign(obj2, orig);
        }
      });
  }
  delSekundarna() {
    let obj = this.dajObjekat(this.sekundarna, "Sekundarna");
    UIkit.modal.confirm(this.i18n.tr("Da li želite da obrišete sekundarnu grupu") + ": " + `${obj.sifra} - ${obj.naziv}` + "?", () => {
      this.obrisi("Sekundarna", obj.id);
    });
  }

  novaTercijarna() {
    //toastr.info(this.dajPredlogSifre("Tercijarna"));
    //toastr.info(this.dajPredlogSifre("Sekundarna"));
    let obj2 = this.repoTercijarna.getNewEntity();

    obj2.id = 0;
    obj2.primarna = this.dajObjekat(this.primarna, "Primarna");
    obj2.sekundarna = this.dajObjekat(this.sekundarna, "Sekundarna");
    obj2.sifra = this.dajPredlogSifre("Tercijarna");
    let obj = {
      naslov: this.i18n.tr("Nova tercijarna grupa"),
      tip: "Tercijarna",
      obj: obj2,
      edit: false,
      repo: this.repo
    };
    this.dialogService.open({ viewModel: EditObim, model: obj })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          //this.primarne.push(response.output.obj);
          this.snimi("Tercijarna", response.output.obj);
        } else {

        }
      });
  }
  izmenaTercijarna() {
    let obj2 = this.dajObjekat(this.tercijarna, "Tercijarna");
    let obj = {
      naslov: `${obj2.sifra} - ${obj2.naziv}`,
      tip: "Tercijarna",
      obj: obj2,
      edit: true,
      repo: this.repo
    };

    let tmp = this.repoTercijarna.getNewEntity();
    tmp.setData(obj2, true);
    let orig = tmp.asObject();

    this.dialogService.open({ viewModel: EditObim, model: obj })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.snimi("Tercijarna", response.output.obj);
        } else {
          Object.assign(obj2, orig);
        }
      });
  }
  delTercijarna() {
    let obj = this.dajObjekat(this.tercijarna, "Tercijarna");
    UIkit.modal.confirm(this.i18n.tr("Da li želite da obrišete tercijarnu grupu") + ": " + `${obj.sifra} - ${obj.naziv}` + "?", () => {
      this.obrisi("Tercijarna", obj.id);
    });
  }
  noviObim() {
    //toastr.info(this.dajPredlogSifre("Obim"));
    //toastr.info(this.dajPredlogSifre("Sekundarna"));
    let obj2 = this.repoObim.getNewEntity();

    obj2.id = 0;
    obj2.sifra = this.dajPredlogSifre("Obim");
    obj2.primarna = this.dajObjekat(this.primarna, "Primarna");
    obj2.sekundarna = this.dajObjekat(this.sekundarna, "Sekundarna");
    obj2.tercijarna = this.dajObjekat(this.tercijarna, "Tercijarna" );
    let obj = {
      naslov: this.i18n.tr("Novi obim poslovanja"),
      tip: "Obim",
      obj: obj2,
      edit: false,
      repo: this.repo
    };
    this.dialogService.open({ viewModel: EditObim, model: obj })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          //this.primarne.push(response.output.obj);
          this.snimi("Obim", response.output.obj);
        } else {

        }
      });
  }
  izmenaObim() {
    let obj2 = this.dajObjekat(this.obim, "Obim");
    let obj = {
      naslov: `${obj2.sifra} - ${obj2.naziv}`,
      tip: "Obim",
      obj: obj2,
      edit: true,
      repo: this.repo
    };

    let tmp = this.repoObim.getNewEntity();
    tmp.setData(obj2, true);
    let orig = tmp.asObject();

    this.dialogService.open({ viewModel: EditObim, model: obj })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.snimi("Obim", response.output.obj);
        } else {
          Object.assign(obj2, orig);
        }
      });
  }
  delObim() {
    let obj = this.dajObjekat(this.obim, "Obim");
    UIkit.modal.confirm(this.i18n.tr("Da li želite da obrišete obim poslovanja") + ": " + `${obj.sifra} - ${obj.naziv}` + "?", () => {
      this.obrisi("Obim", obj.id);
    });
  }

  snimi(tip, objekat) {
    this.repo.post('ObimPoslovanja?tip=' + tip, objekat)
      .then(result => {
        if (result.success) {
          this.reload(true);
          this.i18n.tr("Uspešno snimljeno");
        } else {
          toastr.error(this.i18n.tr("Greška prilikom upisa"));
        }
      })
      .catch(err => {
        toastr.error(err);
      });
  }
  refresh() {
    this.chgPrimarna(this.primarna);
    //this.chgSekundarna(this.sekundarna);
    //this.chgTercijarna(this.tercijarna);
  }
  obrisi(tip, id) {
    this.repo.find("ObimPoslovanja/Obrisi?tip=" + tip + "&id=" + id)
      .then(result => {
        if (result.success) {
          this.reload(true);
          this.i18n.tr("Uspešno snimljeno");
        } else {
          toastr.error(this.i18n.tr("Greška prilikom upisa"));
        }
      })
      .catch(err => {
        toastr.error(err);
      });
  }
  test() {
    let str = `Primarna: ${this.primarna}, sekundarna: ${this.sekundarna}, tercijarna: ${this.tercijarna}, obim: ${this.obim}`
    toastr.info(str);
  }
}
