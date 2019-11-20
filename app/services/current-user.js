import Service from '@ember/service';
import { resolve } from 'rsvp';
//import { inject as service } from '@ember/service';

const { inject: { service }, RSVP } = Ember;


export default Service.extend({
    session: service(),
    store: service(),
    ajax: service(),

    load() {

        return new RSVP.Promise((resolve, reject) => {

            const token = this.get('session.data.authenticated.token');


            if (!Ember.isEmpty(token)) {
                this.get('session.data.authenticated.user')
                resolve();
            } else {
                reject();
            }
        });

        /*console.log(this.get('session.isAuthenticated'))
        if (this.get('session.isAuthenticated')) {
            console.log('Sessão autenticada!');

            const token = this.get('session.data.authenticated.token');
            //console.log('token -< ', token);

            let requestOptions = {
                method: 'GET',
                contentType: "application/json",
                headers: { Authorization: `Bearer ${token}` },
            }
            //To-do: Ajustar essa requisição depois
            //console.log(requestOptions);

            return this.get('session.data.authenticated.user');
            /*return this.get('ajax').request('/me', requestOptions).then(() => {
                this.set('user', result);
            }).catch(err => {
                console.error(err);
            });*/


        //   


        /*} else {
            console.log('Não está autenticada');
            return resolve();
        }*/
    } //Aqui é o fechamento do load()
});

