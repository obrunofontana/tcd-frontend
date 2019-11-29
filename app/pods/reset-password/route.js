import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default Route.extend({


    errorMessage: "",
    ajax: service(),


    model() {
        return {
            passwordReset: "",
            inputConfirmPasswordReset: "",
            tokenReset: "",
        }
    },

    actions: {        
        resetPassword() {

            let controllerLogin = this.controllerFor('login');

            let lThis = this;

            let token = this.get('controller').get('tokenReset');
            let password = this.get('controller').get('passwordReset');
            let passwordConfirm = this.get('controller').get('inputConfirmPasswordReset');
            let emailReset = controllerLogin.get('emailForReset');

            //console.log(password, emailReset, token);

            if (password != passwordConfirm) {
                this.get('controller').set('errorMessage', "Senhas não iguais, confirme");
            } else {
                console.log('Token:', token, 'password: ', password);

                this.get('ajax').request('/reset_password', {
                    method: 'POST',
                    data: {
                        token,
                        password,
                        email: emailReset,
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).then(response => {

                    lThis.get('controller').set('passwordAlter', true);

                    document.getElementById("formResetPassword").reset();

                    // lThis.transitionTo('login');

                }).catch(err => {
                    console.error(err);
                });
            }

        }
    }
});
