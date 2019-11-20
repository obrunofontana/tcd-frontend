import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

import { inject as service } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {

    sessionCurrentUser: service('current-user'),

    beforeModel() {
        this.transitionTo('login');        
        return this._loadCurrentUser();
    },

    async sessionAuthenticated() {
        await this._loadCurrentUser().then(() => {
            this.transitionTo('home');
        }).catch(() => this.get('session').invalidate());
    },

    _loadCurrentUser() {
        //to-do: Ajustar o request do método load no arquivo current-user.js
        return this.get('sessionCurrentUser').load().then(() => {
            this.transitionTo('home');
        }).catch(() => {
            this.get('session').invalidate()
        });
    },
});
