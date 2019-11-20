import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
    session: service(),
    ajax: service(),

    actions: {
        //Autenticação com API desenvolvida e que está rodando na porta 3000;
        async authenticate() {

            let { email, password } = this.getProperties('email', 'password');

            try {
                await this.session.authenticate('authenticator:token', { email, password });
            } catch (error) {
                this.set('errorMessage', error.error || error);
            }

            if (this.session.isAuthenticated) {
                //Se autenticar, faço verificação se o usuário já possui um veiculo
                let currentUser = this.get('session.data.authenticated.user');

                console.log(currentUser);

                if (!isEmpty(currentUser.vehicles)) {
                    this.transitionToRoute('home');

                } else {
                    this.transitionToRoute('welcome');
                }


            }
        },
        //Registra um novo usuário
        async register() {

            //objeto user que será registrado
            let user = this.store.createRecord('user', {
                email: this.get('emailLogin'),
                password: this.get('passwordLogin'),
                name: this.get('name'),
                photo: 'images/userDefault.svg',
                zipCode: '',
                state: '',
                city: '',
                address: '',
                destinationAddress: '',
                vehicles: ''
            });         

            user.save();
            //Defino opções para a requisição
           /* let requestOptions = {
                method: 'POST',
                data: JSON.stringify(user),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            //Defino o email e senha se arequisição do post for bem sucedida chamo authenticação novamente;
            this.set('email', user.email);
            this.set('password', user.password);

            //console.log(t,x);

            //Faz o post da requisição
            this.get('ajax').request('/users', requestOptions)
                .then(result => {

                    this.send('authenticate');
                })
                .catch((err) => {
                    console.log(err);
                });*/

        }
    }
});
