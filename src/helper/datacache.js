import {
  inject
} from 'aurelia-framework'
import {
  Endpoint
} from 'aurelia-api';
//import {EntityManager} from 'aurelia-orm';
@inject(Endpoint.of())
export class DataCache {
  constructor(repo) {
    //this.em = em;
    this.repo = repo;
    console.log('Data cache constructor');
  }
  getParametri() {
    var promise = new Promise((resolve, reject) => {
      if (!this.parametri) {
        this.repo.find('Parametar')
          .then(result => {
            this.parametri = result;
            toastr.info('Učitani parametri ' + result.length);
            resolve(this.parametri);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.parametri);
      }
    });
    return promise;
  }
  getParametar(naziv) {
    var promise = new Promise((resolve, reject) => {
      this.repo.find('Parametar?naziv=' + naziv)
        .then(result => {
          this.parametri = result;
          //toastr.info('Učitani parametri ' + result.length);
          resolve(this.parametri);
        })
        .catch(err => reject(err));
    });
    return promise;
  }
  getKorisnik(id) {
    var promise = new Promise((resolve, reject) => {

      this.repo.find('Korisnik', id)
        .then(result => {
          resolve(result);
        })
        .catch(err => reject(err));

    });
    return promise;
  }
  getPrimarna(force) {
    var promise = new Promise((resolve, reject) => {
      if (!this.primarna || force) {
        this.repo.find('ObimPoslovanja/Primarna')
          .then(result => {
            this.primarna = result;
            resolve(this.primarna);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.primarna);
      }
    });
    return promise;
  }
  getSekundarna(force) {
    var promise = new Promise((resolve, reject) => {
      if (!this.sekundarna || force) {
        this.repo.find('ObimPoslovanja/Sekundarna')
          .then(result => {
            this.sekundarna = result;
            resolve(this.sekundarna);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.sekundarna);
      }
    });
    return promise;
  }
  getTercijarna(force) {
    var promise = new Promise((resolve, reject) => {
      if (!this.tercijarna || force) {
        this.repo.find('ObimPoslovanja/Tercijarna')
          .then(result => {
            this.tercijarna = result;
            resolve(this.tercijarna);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.tercijarna);
      }
    });
    return promise;
  }
  getObim(force) {
    var promise = new Promise((resolve, reject) => {
      if (!this.obim || force) {
        this.repo.find('ObimPoslovanja/Obim')
          .then(result => {
            this.obim = result;
            resolve(this.obim);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.obim);
      }
    });
    return promise;
  }



  getStatusi(vrsta) {
    var promise = new Promise((resolve, reject) => {
      if (!this.statusiPorudzbenica) {
        this.repo.find('Status/?vrsta=' + vrsta)
          .then(result => {
            this.statusiPorudzbenica = result;
            resolve(this.statusiPorudzbenica);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.statusiPorudzbenica);
      }
    });
    return promise;
  }
  getSkladista() {
    var promise = new Promise((resolve, reject) => {
      if (!this.skladista) {
        this.repo.find('Subjekat/Skladista')
          .then(result => {
            this.skladista = result;
            resolve(this.skladista);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.skladista);
      }
    });
    return promise;
  }
  getOdeljenja() {
    var promise = new Promise((resolve, reject) => {
      if (!this.odeljenja) {
        this.repo.find('Subjekat/Odeljenja')
          .then(result => {
            this.odeljenja = result;
            resolve(this.odeljenja);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.odeljenja);
      }
    });
    return promise;
  }
  getMestaIsporuke() {
    var promise = new Promise((resolve, reject) => {
      if (!this.mestaIsporuke) {
        this.repo.find('Subjekat/MestaIsporuke')
          .then(result => {
            this.skladista = result;
            resolve(this.mestaIsporuke);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.mestaIsporuke);
      }
    });
    return promise;
  }
}
