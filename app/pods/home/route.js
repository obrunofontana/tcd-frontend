import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { observer } from '@ember/object';


export default Route.extend({
    session: service(),
    ajax: service(),
    zip: false,
    info: null,
    userInfo: null,

    transitionHomeSelected: observer('zip', function () {

        if (!this.get('zip')) {


            this.transitionTo('home');

        } else {
            this.transitionTo('welcome');
        }

    }),

    model() {



        if (this.session.isAuthenticated) {

            let user = this.get('session.data.authenticated.user');
            let emailaux = this.get('session.data.authenticated.user.email');

            // console.log('usuario rota home' , user);


            let lThis = this;

            this.get('ajax').request('/users/email/' + emailaux)
                .then((result) => {
                    let aux = isEmpty(result.result.zipCode);//result.result.zipCode

                    console.log('model home result ->', result.result);


                    return lThis.set('zip', aux);
                })
                .catch((e) => {
                    console.error(e);
                });

            this.set('info', user.vehicles);

            return user
        }
    },

    beforeModel() {
        //Mandar autenticar novamente
      //  let controllerLogin = this.controllerFor('login');

        let emailaux = this.get('session.data.authenticated.user.email');

        //controllerLogin.send('authenticate');
        //console.log(controllerLogin);

        let lThis = this;

        this.get('ajax').request('/users/email/' + emailaux)
            .then((result) => {

                console.log('before model home result ->', result.result);

                return lThis.set('userInfo', result.result);
            })
            .catch((e) => {
                console.error(e);
            });

    }
});
