import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {ValidationControllerFactory, ValidationController,ValidationRules, validateTrigger} from 'aurelia-validation';
import {Endpoint} from 'aurelia-api';
import {AltairCommon} from 'helper/altair_admin_common';
@inject(DialogController, ValidationControllerFactory,Endpoint.of(), AltairCommon)

export class Promena {
    password = '';
    confirmPassword = '';

    constructor(controller, controllerFactory, repo,ac) {
        this.controller = controller;
        this.ac = ac;
        this.validcontroller = controllerFactory.createForCurrentScope();
        this.validcontroller.validateTrigger = validateTrigger.manual;
        this.repo = repo;
    }

    activate(message) {
        this.message = message;
        //this.novaLozinka = obj.novaLozinka;
    }
    cancel() {
        this.dialogController.cancel();
    }
    attached() {
        this.ac.altair_md.init();
    }
    promena() {
        this.validcontroller.validate()
            .then(result => {
                result.forEach(r => {
                    toastr.error(r.message);
                });
                if (result.length === 0) {
                    this.repo.post('Korisnik/PromenaLozinke', {lozinka: this.password})
                        .then(result => {
                            this.controller.ok();
                        })
                        .catch(err => {
                            toastr.error(err.statusText);
                        });
                }
            });
    }

}
ValidationRules.customRule(
  'matchesProperty',
  (value, obj, otherPropertyName) => 
      value === null
      || value === undefined
      || value === ''
      || obj[otherPropertyName] === null
      || obj[otherPropertyName] === undefined
      || obj[otherPropertyName] === ''
      || value === obj[otherPropertyName],
  //'${$displayName} must match ${$getDisplayName($config.otherPropertyName)}',
  'Lozinke moraju biti identične',
  otherPropertyName => ({ otherPropertyName })
);


ValidationRules
  .ensure(a => a.password).displayName('Lozinka')
    .required().withMessage(`Morate uneti lozinku`)
    .minLength(3).withMessage(`Morate uneti bar 3 karaktera za lozinku`)
  .ensure(a => a.confirmPassword)
    .required().withMessage(`Morate ponoviti lozinku`)
    //.minLength(3).withMessage(`Morate uneti bar 3 karaktera`)
    .satisfiesRule('matchesProperty', 'password')
.on(Promena);