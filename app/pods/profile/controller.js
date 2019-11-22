import Controller from '@ember/controller';
import fetch from 'fetch';
import { observer } from '@ember/object';
import { isEmpty } from '@ember/utils';

const { inject: RSVP } = Ember;

export default Controller.extend({
    session: Ember.inject.service(),
    ajax: Ember.inject.service(),

    //Utilizo o observer para verificar o state da veriavel, se mudou realizo o load das informaçõs em tela.
    valueSelected: observer('selected', function () {

        this.send('loadInfos');
    }),

    //Controle dos Steps
    stepCar: true,
    stepAddress: false,
    stepAddressDestination: false,



    //Variavel de Controle null's 
    upd: null,
    selec: null,
    marcaSelected: null,
    veiculoSelectd: null,
    anoSelected: null,
    estadoSelect: null,
    setMuniSelected: null,
    estadoSelect: null,
    setMuniSelected: null,
    descMun: null,
    municipioSelect: null,
    ufEstadoSelect: null,

    //Variavel de Controle arrays
    veiculos: [], //todos os veiculos da marca
    anoModelo: [], //Modelos por ano
    estados: [], //array de estados
    municipios: [], //array com municipios


    byCep: false,
    statusLoadMun: false,

    //Variaveis de controle objetos  
    infoVeiculo: "",
    urlInfoVeiculo: "",

    addressTemp: {},


    page: 1,

    getVeiculosByMarca(marca) {


        this.get('ajax').request('http://fipeapi.appspot.com/api/1/carros/veiculos/' + marca + '.json')
            .then(data => {
                return this.saveVeiculos(data);
            })
            .catch((e) => {
                console.error(e);
            });

    },
    saveVeiculos(dados) {

        this.set('veiculos', dados);
        let marca = this.get('marcaSelected');

        let thisAux = this;

        dados.forEach(el => {

            //Preparação dos dados a serem salvos
            let objAux = {
                key: el.id,
                name: el.name,
                fipeName: el.fipe_name,
                brand: parseInt(marca)
            }
            //Conversão do objeto em string para conseguir enviar pelo método ajax abaixo
            let obj = JSON.stringify(objAux);

            //Salvo na minha API 
            thisAux.get('ajax').request('/vehicles', {
                method: 'POST',
                data: obj,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
                .then(data => {
                    return data;
                })
                .catch((e) => {
                    console.error(e);
                });
        });
    },
    getModelosByVeiculo(marca, veiculo) {

        //console.log('aqui ó -> ', marca, veiculo)

        this.get('ajax').request('http://fipeapi.appspot.com/api/1/carros/veiculo/' + marca + '/' + veiculo + '.json')
            .then(data => {

                return this.saveModelos(data);
            })
            .catch((e) => {
                console.error(e);
            });

    },
    saveModelos(modelos) {

        let marcaId = this.get('marcaSelected');
        let veiculoId = this.get('veiculoSelectd');

        let thisAux = this;

        let modelsAux = [];

        modelos.forEach(modelo => {

            let objAux = {
                key: modelo.id,
                name: modelo.name,
                fipeName: modelo.fipe_name,
                marca: modelo.marca,
                veiculo: modelo.veiculo,
                fipeMarca: modelo.fipe_marca,
                fipeCodigo: modelo.fipe_codigo,
                marcaId: parseInt(marcaId),
                veiculoId: parseInt(veiculoId)
            };

            modelsAux.push(objAux);

        });
        this.set('anoModelo', modelsAux);

        modelos.forEach(modelo => {

            //console.log(modelo);

            //Preparação dos dados a serem salvos
            let objAux = {
                key: modelo.id,
                name: modelo.name,
                fipeName: modelo.fipe_name,
                marca: modelo.marca,
                veiculo: modelo.veiculo,
                fipeMarca: modelo.fipe_marca,
                fipeCodigo: modelo.fipe_codigo,
                marcaId: parseInt(marcaId),
                veiculoId: parseInt(veiculoId)
            }
            //Conversão do objeto em string para conseguir enviar pelo método ajax abaixo
            let obj = JSON.stringify(objAux);
            //console.log('-> ' + obj);

            modelsAux.push(obj);

            //Salvo na minha API 
            thisAux.get('ajax').request('/models', {
                method: 'POST',
                data: obj,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
                .then(data => {
                    return data;
                })
                .catch((e) => {
                    console.error(e);
                });

        });

    },
    loadEstados() {

        this.get('ajax').request('/states')
            .then((data) => {

                if (data.states.length > 0) {
                    return this.set('estados', data.states);
                } else {
                    return this.getEstados();
                }

            }).catch((e) => {
                console.log(e);

            });

    },
    getEstados() {

        this.get('ajax').request('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then((data) => {
                this.set('estados', data);
                return this.saveEstados(data);
            })
            .catch((e) => {
                console.error(e);
            });
    },
    saveEstados(estados) {

        estados.forEach(estado => {

            let obj = JSON.stringify({
                key: estado.id,
                name: estado.nome,
                sigla: estado.sigla
            });

            this.get('ajax').request('/states', {
                method: 'POST',
                data: obj,
                contentType: "application/json; charset=utf-8",
                dataType: "json"

            }).then((data) => {
                return data;

            }).catch((e) => {
                console.error(e);

            });

        })

    },
    loadMunicipiosByEst(estId, param = "") {

        //Quando realizo a busca pelo CEP, carrego apenas o municipo do CEP digitado
        if (this.get('byCep')) {

            return new Promise((resolve, reject) => {

                this.get('ajax').request('/counties/' + param)
                    .then((data) => {

                        if (!isEmpty(data.result)) {
                            this.set('ufEstadoSelect', data.result.uf);
                            let aResult = [];

                            aResult.push(data.result);

                            resolve(this.set('municipios', aResult));

                        } else {
                            resolve(this.getMunicipiosByEst(estId));
                        }


                    })
                    .catch((e) => {

                        reject(e);
                    });

            });



        } else {
            //Se a busca é realizada pelo estado, busco todos os municipios deste estado.
            return new Promise((resolve, reject) => {

                this.get('ajax').request('/counties/state/' + estId)
                    .then((data) => {

                        if (data.result.length > 0) {
                            this.set('ufEstadoSelect', data.result[0].uf);

                            resolve(this.set('municipios', data.result));

                        } else {
                            resolve(this.getMunicipiosByEst(estId));
                        }

                    })
                    .catch((e) => {

                        reject(e);
                    });

            });

        }

    },
    getMunicipiosByEst(est) {

        this.get('ajax').request('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + est + '/municipios')
            .then((data) => {
                //Seto a sigla do estado dos municipios que estão sendo listados, para utilizar na API Via CEP
                this.set('ufEstadoSelect', data[0].microrregiao.mesorregiao.UF.sigla);

                return this.saveCounties(data);

            })
            .catch((e) => {
                console.error(e);
                console.log('ERROR: Deu ruim :(');

            });

    },
    saveCounties(counties) {

        //Crio este array pois o nome dos atributos que vem da API Externa são diferente da API Interna
        //E para cada item da api externa que vou salvar adiciono neste array para apresentar os dados;
        let countieAux = [];

        counties.forEach(countie => {
            //Monto o objeto para enviar via ajax/post
            let objCountie = JSON.stringify({
                key: countie.id,
                name: countie.nome,
                state: countie.microrregiao.mesorregiao.UF.id,
                uf: countie.microrregiao.mesorregiao.UF.sigla
            });

            this.get('ajax').request('/counties', {
                method: 'POST',
                data: objCountie,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).then(data => {
                return data;

            }).catch(e => {
                return console.error(e);
            });

            countieAux.push(JSON.parse(objCountie));
        });

        this.set('municipios', countieAux);
        this.set('statusLoadMun', true);

    },
    getUfMun() {

        let obj = {
            uf: this.get('ufEstadoSelect'),
            countie: this.get('municipioSelect')
        }



        return obj;

    },


    searchLog(term) {
        //  let uf = window.document.querySelector(".bt-state").value;
        let countie;
        let localidade = window.document.getElementById('inputGCity').value;

        if (isEmpty(localidade)) {

            countie = window.document.querySelector(".bt-city").value;

        } else {
            countie = localidade;
        }


        // let stataAux = this.getUfMun();
        let uf = 'PR'; //to-do: Pensar em uma forma de pegar o estado

        //verifico se a string é mair que 3 pois a URL só é válida se possuir mai de 3 caracteres como busca;
        if (term.length > 3) {

            let url = `http://viacep.com.br/ws/${uf}/${countie}/${term}/json`;

            return fetch(url).then((resp) => resp.json())
                .then((data) => {

                    let json = [];
                    //Percorro os dados para conseguir concatenar o complemento (numero de até) com o logradour
                    data.forEach(element => {

                        let obj = {};

                        //Verifico se há complemento, caso contrario mostro apenas o logradour; Exemplo de cidade que não possui: FRANCISCO BELTRÃO,
                        //Geralmente complemento é só em CIDADE GRANDE.
                        let logradouro = element.complemento == "" ? element.logradouro : (element.logradouro + ' - ' + element.complemento);

                        obj = {
                            logradouro: logradouro,
                            cep: element.cep,
                            bairro: element.bairro
                        };

                        json.push(obj);

                    });

                    return json;
                });

        }
    },


    actions: {
        loadInfos() {
            let obj = this.get('selected');
            let inpAux = window.document.getElementById('inputGCity');
            
            this.set('addressTemp', obj);


            if (!isEmpty(obj) && isEmpty(inpAux)) {
                let inBairro = window.document.getElementById('input-bairro');
                let inCep = window.document.getElementById('cep');

                //Atribuo os valores para os inputs
                inBairro.value = obj.bairro;


                this.set('cep', parseInt(obj.cep.replace('-', ''))); //Atribuio desta forma quando buscado por endereço e não valor digitado


                //Tratamento dos items da lista, adicionando a classe para o comportamento do component não se perca
                let elLiBairr = inBairro.parentElement.parentElement.parentElement.parentElement;
                let elLiCep = inCep.parentElement.parentElement.parentElement.parentElement;

                if (elLiBairr.classList || elLiCep.classList) {

                    elLiBairr.classList.add('item-input-with-value');
                    elLiCep.classList.add('item-input-with-value');

                } else {

                    elLiBairr.className += ' item-input-with-value';
                    elLiCep.className += ' item-input-with-value';
                }
            }

        },
        findCep() {
            this.set('byCep', true);

            let valor = this.get('cep');
            let lThis = this;

            //Nova variável "cep" somente com dígitos.
            var cep = valor.replace(/\D/g, '');

            //Verifica se campo cep possui valor informado.
            if (cep != "") {

                if (cep.length == 8) {

                    //Expressão regular para validar o CEP.
                    var validacep = /^[0-9]{8}$/;

                    //Valida o formato do CEP.
                    if (validacep.test(cep)) {

                        this.get('ajax').request('https://viacep.com.br/ws/' + cep + '/json/')
                            .then(data => {
                                //console.log(data.ibge.trim().substr(0, 2) + ' - ' + data.ibge + JSON.stringify(data));
                                this.set('addressTemp', data);

                                let btState = window.document.querySelector(".bt-state");
                                btState.value = data.ibge.substr(0, 2);


                                let elNumeroCasa = window.document.getElementById("input-nrCasa"); //Apenas para setar o foco neste input
                                let elBairro = window.document.getElementById("input-bairro");
                                let elEndereco = window.document.getElementById("input-endereco");

                                //Atribuo os valores para os inputs 
                                elBairro.value = data.bairro;
                                elEndereco.value = data.logradouro;

                                //Busco a referência do elemento <li>
                                let liElementBairro = elBairro.parentElement.parentElement.parentElement.parentElement;
                                let liElementEndereco = elEndereco.parentElement.parentElement.parentElement.parentElement;

                                //continuar daquui 
                                if (liElementBairro.classList || liElementEndereco.classList) {

                                    liElementBairro.classList.add('item-input-with-value');
                                    liElementEndereco.classList.add('item-input-with-value');

                                } else {

                                    liElementBairro.className += ' item-input-with-value';
                                    liElementEndereco.className += ' item-input-with-value';
                                }



                                lThis.send('setSelectEstado', data.ibge.trim().substr(0, 2), data.ibge);
                                elNumeroCasa.focus();

                            })
                            .catch(e => {
                                console.error(e);
                            });

                    } //end if.
                    else {
                        //cep é inválido.
                        console.log('Formato de Cep Inválido');

                        alert("Formato de CEP inválido.");
                    }

                } else {
                    //Cep com caracteres a menos
                    console.log('cep com menos de 8 digitos');
                    this.set('selected', '');

                }


            } //end if.
            else {
                //cep sem valor, limpa formulário.              
                this.set('byCep', false);
                this.set('selected', '');
                window.document.querySelector(".bt-state").value = "-- Selecione seu Estado --";
                window.document.querySelector(".bt-city2").value = "-- Selecione seu Estado --";
                window.document.getElementById('input-bairro').value = "";


            }
        },

        setSelectMarca: function (selected) {
            this.set('marcaSelected', selected);

            let idMarca = this.get('marcaSelected');

            this.get('ajax').request('/vehicles/brands/' + idMarca)
                .then(data => {
                    if (data.result.length > 0) {
                        return this.set('veiculos', data.result);
                    } else {
                        return this.getVeiculosByMarca(idMarca);
                    }

                })
                .catch((e) => {
                    console.error(e);
                });

        },
        setSelectVeic: function (selected) {
            this.set('veiculoSelectd', selected);
            let marca = this.get('marcaSelected');
            let veiculo = this.get('veiculoSelectd');

            //Seleciono os modelos por veiculo 
            this.get('ajax').request('/models/vehicles/' + veiculo)
                .then(data => {
                    if (data.result.length > 0) {
                        return this.set('anoModelo', data.result);
                    } else {
                        return this.getModelosByVeiculo(marca, veiculo);
                    }

                })
                .catch((e) => {
                    console.error(e);
                });

        },
        setSelectAno: function (selected) {
            this.set('anoSelected', selected);

            let marca = this.get('marcaSelected'),
                veiculo = this.get('veiculoSelectd'),
                ano = this.get('anoSelected');

            this.set('urlInfoVeiculo', `http://fipeapi.appspot.com/api/1/carros/veiculo/${marca}/${veiculo}/${ano}.json`);

        },
        nextStep(step) {

            switch (step) {
                case 'address':
                    let kilometragem = this.get('kmRodados');

                    this.loadEstados();

                    this.set('stepCar', false);
                    this.set('stepAddress', true);

                    this.get('ajax').request(this.get('urlInfoVeiculo'))
                        .then(result => {

                            let veiculo = {
                                name: result.name,
                                combustivel: result.combustivel,
                                marca: result.marca,
                                anoModelo: result.anoModelo,
                                kilometragem: kilometragem
                            }

                            //Preparo as informações 
                            this.set('infoVeiculo', JSON.stringify(veiculo));

                        })
                        .catch(err => {
                            console.error(err);
                        });
                    break;
                case 'addressDestination':
                    this.set('stepAddress', false);

                    let endTemp = this.get('addressTemp');

                    console.log(this.getUfMun());

                    this.set('stepAddressDestination', true);

                    setTimeout(function () {
                        window.document.getElementById('inputGCity').value = endTemp.localidade;

                        alert("Hello");
                    }, 200);




                default:
                    break;

            }
        },
        setSelectEstado(selected, defaul = "") {
            this.set('estadoSelect', selected);
            let estado = this.get('estadoSelect');

            if (isEmpty(defaul)) {

                this.loadMunicipiosByEst(estado).then(resul => {
                    console.log('Carregou municipos com sucesso!');
                }).catch(e => {
                    console.error(e);
                })

            } else {
                this.loadMunicipiosByEst(estado, defaul)
                    .then(result => {
                        window.document.querySelector(".bt-city2").value = defaul;

                    })
                    .catch(e => {
                        console.error(e);
                    });
            }
        },
        setSelectMun(selected) {
            this.set('municipioSelect', selected);

            let obj = this.getUfMun();

            console.log(obj);
        },

        submit: function () {
            let selectedOption = this.get('selectedOption')
            console.log(selectedOption);
            //To-Do: Aqui será atualizado as informações do usuário:
            // adicionando um novo veiculo ao mesmo. 
        },
    }
});
