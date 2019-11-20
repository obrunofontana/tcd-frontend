import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';
import { inject as service } from '@ember/service';

export default AjaxService.extend({
    host: 'http://localhost:3000',
    session: service(),      

    headers: Ember.computed('session.data.authenticated.token', {
        get() {
            let headers = {};
            const token = this.get('session.data.authenticated.token');
            console.log(token);
            //data.authenticated.token
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;                
            }
            console.log(headers)
            return headers;
        }
    })
});