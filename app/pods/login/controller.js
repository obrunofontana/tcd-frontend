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


            let teste = JSON.stringify({
                email: "amanda@gmail.com",
                password: "123456"
            });


            //this.get('emailLogin')

            //objeto user que será registrado
            /*let user = this.store.createRecord('user', {
                email: useraux,
                password: senha,
                name: "bruno",
                photo: "images/userDefault.svg",
                zipCode: "",
                state: "",
                city: "",
                address: "",
                destinationAddress: "",
                vehicles: ""
            });*/
            let options = {
                method: 'POST',
                data: teste,

            }
            console.log(teste);

                this.get('ajax').request('/users', options)
                    .then(result =>{
                        console.log(result);
                    })
                    .catch(err =>{
                        console.error(err);
                    })

            /*user.save().then(result =>{
                 console.log('deu boa');
             })
             .catch(error =>{
                 console.log('deu ruim');
                 console.error(JSON.stringify(error.errors.detail));
             });*/
            //Defino opções para a requisição


            //Defino o email e senha se arequisição do post for bem sucedida chamo authenticação novamente;
            //  this.set('email', user.email);
            //  this.set('password', user.password);



        }
    }
});
