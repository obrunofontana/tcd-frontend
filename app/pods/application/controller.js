import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Controller.extend(ApplicationRouteMixin, {
    session: service(),   

    actions: {

        logout() {
            this.transitionToRoute('login');
        }
    }
});