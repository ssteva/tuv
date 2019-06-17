import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { AltairCommon } from 'helper/altair_admin_common';
@inject(DialogController, AltairCommon)

export class Prompt {

  constructor(controller, ac) {
    this.controller = controller;
    this.ac = ac;
    //this.controller.settings.lock = false;
    //controller.settings.centerHorizontalOnly = true;
  }
  afterAttached() {
    this.ac.altair_md.init();
    //$('[name="opt"]')
    //  .on('ifChecked', (event) => {
    //    if (event.target.id === 'da') {
    //      this.ishod = true;
    //    } else {
    //      this.ishod = false;
    //    }
    //  });
  }

  activate(obj) {
    this.naslov = obj.naslov;
  }
  cancel() {
    this.controller.cancel();
  }

  potvrdi() {
    this.controller.ok(this.komentar);
  }
}
