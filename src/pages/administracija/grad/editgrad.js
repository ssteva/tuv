import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {AltairCommon} from 'helper/altair_admin_common';
import {EntityManager} from 'aurelia-orm';
import {Endpoint} from 'aurelia-api';
import {DataCache} from 'helper/datacache';

@inject(DialogController, AltairCommon, EntityManager, Endpoint.of(), DataCache)
export class EditGrad{
    constructor(dialogController, ac, em, repo, dataCache) {
        this.dialogController = dialogController;
        this.ac = ac;
        this.em = em;
        this.repo = repo;
        this.dataCache = dataCache;
        this.repoGrad = em.getRepository('mesto');
    }

    activate(grad) {
        return this.dataCache.getDrzave()
            .then(result=>{
                this.drzave = result;
                if (grad) {
                    this.grad = this.repoGrad.getPopulatedEntity(grad);
                    this.naslov = "Izmena podataka";
                } else {
                    this.grad = this.repoGrad.getNewEntity();
                    this.naslov = "Unos novog grada";
                }
            })
            .error(err=>{
                toastr.error(err.statusText);
            });
        
    }

    attached() {
        this.ac.altair_md.init();
    }

    cancel() {
        this.dialogController.cancel();
    }
    save() {
        this.grad
            .update()
            .then(result => {
                this.dialogController.ok();
            })
            .catch(err => {
                toastr.error(err.statusText);
            });

    }

}