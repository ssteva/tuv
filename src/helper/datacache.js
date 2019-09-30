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
    dajPoreskuStopu() {
        var promise = new Promise((resolve, reject) => {
            if (!this.poreskStopa) {
                this.repo.find('Parametar?naziv=PoreskaStopa')
                    .then(result => {
                        this.poreskStopa = result;
                        resolve(this.poreskStopa);
                    })
                    .catch(err => reject(err));
            } else {
                resolve(this.poreskStopa);
            }
        });
        return promise;
    }
    brojDokumenata(tip, idklijent) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find('Klijent/BrojDokumenata?tip=' + tip + "&idklijent=" + idklijent)
                .then(result => {
                    //toastr.info('Učitani parametri ' + result.length);
                    resolve(result);
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
    dajPonudeZaKlijenta(klijentid) {
        var promise = new Promise((resolve, reject) => {

            this.repo.find('Ponuda/PonudeZaKlijenta?id=' + klijentid)
                .then(result => {
                    resolve(result);
                })
                .catch(err => reject(err));

        });
        return promise;
    }
    dajIzvrsioce() {
        var promise = new Promise((resolve, reject) => {

            this.repo.find('Korisnik/ListaIzvrsitelja')
                .then(result => {
                    resolve(result);
                })
                .catch(err => reject(err));

        });
        return promise;
    }
    dajRukovodioce() {
        var promise = new Promise((resolve, reject) => {

            this.repo.find('Korisnik/ListaRukovodioca')
                .then(result => {
                    resolve(result);
                })
                .catch(err => reject(err));

        });
        return promise;
    }
    dajPonudaStatuse() {
        var promise = new Promise((resolve, reject) => {
            this.repo.find('Ponuda/PonudaStatusi')
                .then(result => {
                    resolve(result);
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    dajNalogStatuse() {
        var promise = new Promise((resolve, reject) => {
            this.repo.find('Nalog/NalogStatusi')
                .then(result => {
                    resolve(result);
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    dajSveKlijente(id) {
        var promise = new Promise((resolve, reject) => {

            this.repo.find('Klijent/dajSveKlijente')
                .then(result => {
                    resolve(result);
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    dajKlijenta(id) {
        var promise = new Promise((resolve, reject) => {

            this.repo.find('Klijent/' + id)
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
                        if (result.success) {
                            this.primarna = result.obj;
                            resolve(result.obj);
                        }
                        else {
                            reject("Error");
                        }
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
                        if (result.success) {
                            this.sekundarna = result.obj;
                            resolve(result.obj);
                        }
                        else {
                            reject("Error");
                        }
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
                        if (result.success) {
                            this.tercijarna = result.obj;
                            resolve(result.obj);
                        }
                        else {
                            reject("Error");
                        }
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
                        if (result.success) {
                            this.obim = result.obj;
                            this.obim.forEach(o => {
                                //o.grupa = (o.primarna ? o.primarna.naziv + ' ' : '') + (o.sekundarna ? o.sekundarna.naziv : '');
                                o.naziv = o.sifra + " " + o.naziv;
                                o.grupa = (o.sekundarna ? o.sekundarna.naziv : (o.primarna ? o.primarna.naziv : ''));
                            })
                            resolve(result.obj);
                        }
                        else {
                            reject("Error");
                        }
                    })
                    .catch(err => reject(err));
            } else {
                resolve(this.obim);
            }
        });
        return promise;
    }
    dajDokumenta(entitet, entitetoipis, entitetid) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find(`Dokument/Lista?entitet=${entitet}&entitetopis=${entitetoipis}&entitetid=${entitetid}`)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    dajZapise(nalogid) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find(`Zapis/Lista?nalogid=${nalogid}`)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    dajUplate(nalogid) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find(`Finansije/ListaUplata?nalogid=${nalogid}`)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    dajFakture(nalogid) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find(`Finansije/ListaFaktura?nalogid=${nalogid}`)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    dajFinansije(nalogid, vrsta) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find("Finansije/Lista?nalogid=" + nalogid + "&vrsta=" + vrsta)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    brisiDokument(id) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find("Dokument/Brisi?id=" + id)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    brisiZapis(id) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find("Zapis/Brisi?id=" + id)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    brisiFinansije(id, vrsta) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find("Finansije/Brisi?id=" + id)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    brisiUplatu(id) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find("Finansije/BrisiUplatu?id=" + id)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }
    brisiFakturu(id) {
        var promise = new Promise((resolve, reject) => {
            this.repo.find("Finansije/BrisiFakturu?id=" + id)
                .then(result => {
                    if (result.success)
                        resolve(result.obj);
                    else {
                        reject("Error");
                    }
                })
                .catch(err => reject(err));
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

}
