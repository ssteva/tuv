﻿import { Endpoint } from 'aurelia-api';
import { inject } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { EntityManager } from 'aurelia-orm';
import 'kendo/js/kendo.dropdownlist';
import 'kendo/js/kendo.numerictextbox.js';
import { Common } from 'helper/common';
import { AltairCommon } from 'helper/altair_admin_common';
import { Router } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

@inject(AuthService, EntityManager, AltairCommon, Endpoint.of(), Common, Router, I18N)
export class Kurs {


    constructor(authService, em, ac, repo, common, router, i18n) {
        this.authService = authService;
        this.repo = repo;
        //this.repoKorisnik = em.getRepository('korisnik');
        this.ac = ac;
        this.common = common;
        this.router = router;
        this.i18n = i18n;
        let payload = this.authService.getTokenPayload();
        if (payload) {
            this.korisnik = payload.unique_name;
            this.role = payload.role;
        }

        this.godine = [new Date().getFullYear(), new Date().getFullYear() - 1];
        this.godina = this.godine[0];
        this.valuta = this.common.valute[0];

    }
    activate() {
        return this.podaci(this.godina, this.valuta);
    }
    onSelectGodina(e) {
        let dataItem = this.cboGodina.dataItem(e.item);
        this.podaci(dataItem, this.valuta);
    }

    podaci(godina, valuta) {
        this.repo.find('KursnaLista?godina=' + godina + "&valuta=" + valuta)
            .then(result => {
                if (result.success) {
                    this.lista = result.obj;
                } else {
                    console.log(obj.message);
                    toastr.error("Greška");
                }
            })
            .catch(err => {
                toastr.error(err);
            });
    }
    promeni(kurs) {
        UIkit.modal.confirm(this.i18n.tr('Da li želite da promenite kurs u dokumentima za kursnu nedelju') + " " + kurs.nedelja, () => {
            this.repo.find('KursnaLista/PromeniKurs?godina=' + kurs.godina + "&nedelja=" + kurs.nedelja + "&valuta=" + kurs.valuta + "&kurs=" + kurs.kurs)
                .then(result => {
                    toastr.success(this.i18n.tr("Uspešno snimljeno"));
                })
                .catch(err => {
                    toastr.error(err);
                });
        });
    }
    snimi() {
        UIkit.modal.confirm(this.i18n.tr('Da li želite da sačuvate izmene?'), () => {
            this.repo.post('KursnaLista/', this.lista)
                .then(result => {
                    if (result.success) {
                        toastr.success(this.i18n.tr("Uspešno snimljeno"));
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
