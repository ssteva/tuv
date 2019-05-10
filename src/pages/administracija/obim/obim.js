import {Endpoint} from 'aurelia-api';
import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';
import {EntityManager} from 'aurelia-orm';
import 'kendo/js/kendo.dropdownlist';
import { DataCache } from 'helper/datacache';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';

@inject(AuthService, EntityManager, AltairCommon,  Endpoint.of(), Common, Router, DataCache)
export class Obim {
  

  constructor(authService, em, ac,  repo, common, router, dataCache) {
    this.authService = authService;
    this.repo = repo;
    //this.repoKorisnik = em.getRepository('korisnik');
    this.ac = ac;
    this.dc = dataCache;
    this.common = common;
    this.router = router;

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
    this.reload();
  }
  reload() {
    let promises = [];

    promises.push(this.dc.getPrimarna());
    promises.push(this.dc.getSekundarna());
    promises.push(this.dc.getTercijarna());
    promises.push(this.dc.getObim());

    return Promise.all(promises)
      .then(res => {
        this.primarne = res[0].obj;
        this.sekundarne = res[1].obj;
        this.tercijarne = res[2].obj;
        this.obimi = res[3].obj;
      })
      .catch(err => {
        toastr.error(err.statusText ? err.statusText : err);
      });
  }
  this.vratiObjekat(id, tip){
    
  }

  chgPrimarna(primarna) {
    this.odabranesekundarne = this.sekundarne.filter(e => {
      return e.primarna.id === primarna;
    })
    this.chgTercijarna(this.tercijarna);
  }
  chgSekundarna(sekundarna) {
    this.odabranetercijarne = this.tercijarne.filter(e => {
      if (this.primarna)
        return e.sekundarna.id === sekundarna && e.primarna.id === this.primarna;
    })
    this.chgTercijarna(this.tercijarna);
  }

  chgTercijarna (tercijarna) {
    this.odabraniobimi = this.obimi.filter(e => {
      if (this.primarna && this.sekundarna && this.tercijarna)
        return e.primarna.id === this.primarna && e.sekundarna.id === this.sekundarna && e.tercijarna.id === tercijarna;
      if (this.primarna && !this.sekundarna && this.tercijarna)
        return e.primarna.id === this.primarna && e.tercijarna.id === tercijarna && !e.sekundarna;
      if (this.primarna && this.sekundarna && !this.tercijarna)
        return e.primarna.id === this.primarna && e.sekundarna.id === this.sekundarna && !e.tercijarna;
      if (this.primarna && !this.sekundarna && !this.tercijarna)
        return e.primarna.id === this.primarna && !e.sekundarna && !e.tercijarna;
    })
  }
  chgObim(obim) {

  }

  novaPrimarna() {
    toastr.info('nov primarna');
  }
  delPrimarna() {
    UIkit.modal.confirm('Da li elite da obrišete primarnu oblast:' + `${this.sekundarne.sifra} - ${this.primarna.naziv}` + "?", () => {
      this.klijent.kontakti[indeks].obrisan = 1;
    });
  }
  novaSekundarna() {
    toastr.info('nov primarna');
  }
  delSekundarna() {
    UIkit.modal.confirm('Da li elite da obrišete primarnu oblast:' + `${this.primarna.sifra} - ${this.primarna.naziv}` + "?", () => {
      this.klijent.kontakti[indeks].obrisan = 1;
    });
  }
  novaTercijarna() {
    toastr.info('nova tercijarna');
  }
  delTercijarna() {
    UIkit.modal.confirm('Da li elite da obrišete primarnu oblast:' + `${this.primarna.sifra} - ${this.primarna.naziv}` + "?", () => {
      this.klijent.kontakti[indeks].obrisan = 1;
    });
  }
  noviObim() {
    toastr.info('novi obim');
  }
  delObim() {
    UIkit.modal.confirm('Da li elite da obrišete primarnu oblast:' + `${this.primarna.sifra} - ${this.primarna.naziv}` + "?", () => {
      this.klijent.kontakti[indeks].obrisan = 1;
    });
  }

  snimi() {
    let str = `Primarna: ${this.primarna}, sekundarna: ${this.sekundarna}, tercijarna: ${this.tercijarna}, obim: ${this.obim}`
    toastr.info(str);
  }
}
