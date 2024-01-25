<template>
  <div class="container">
    <h1>Buscar Estabelecimentos</h1>
    <form>
      <div class="divisor">
        <label for="tipo">Tipo de estabelecimento</label>
        <input v-model="tipo" type="text" name="tipo" id="tipo" placeholder="Digite o tipo de estabelecimento"
               required/>
      </div>
      <div class="divisor">
        <label for="cidade">Nome da cidade</label>
        <input v-model="cidade" type="text" @change="buscarEstados" name="cidade" id="cidade"
               placeholder="Digite o nome da cidade"/>
      </div>
      <div class="divisor">
        <label for="estado">Selecione o estado</label>
        <select v-model="estadoSelecionado" name="estado" id="estado">
          <option disabled selected>Selecione o estado</option>
          <option v-for="estado in estados" :key="estado.sigla" :value="estado.sigla">{{ estado.nm_sigla }}</option>
        </select>
      </div>
      <div class="divisor">
        <button @click.prevent="buscarDados">Buscar</button>
      </div>
    </form>
  </div>
  <div class="infos">
    <div class="base-infos" v-for="(info, index) in dados" :key="index">
      <span v-if="info.icon_background_color" :style="{'background': info.icon_background_color}">
        <img v-if="info.icon" :src="info.icon">
      </span>
      <span v-if="info.name" :style="{'color': info.icon_background_color}">
        {{ info.name }}
      </span>
      <span v-if="info.formatted_address">
        {{ info.formatted_address }}
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tipo: '',
      cidade: '',
      estadoSelecionado: '',
      estados: [],
      dados: [],
    };
  },
  methods: {
    async buscarDados() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/buscar-estabelecimentos', {
          params: {
            gl: 'br',
            hl: 'pt-BR',
            cidade: this.cidade,
            tipo: this.tipo,
            estadoSelecionado: this.estadoSelecionado
          }
        });

        this.dados = response.data.response;

      } catch (error) {
        console.error('Erro na solicitação:', error.message);
      }
    },

    buscarEstados() {
      return axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
          .then(response => {
            const estados = response.data.sort((a, b) => a.nome.localeCompare(b.nome));

            if (this.cidade && this.cidade.trim() !== '') {
              const formatoCidade = this.cidade.replace(/\s+/g, '-');
              const urlCidades = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${formatoCidade.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;

              return axios.get(urlCidades)
                  .then(response => {
                    if (Array.isArray(response.data)) {
                      this.estados = response.data.map(item => ({
                        sigla: item.microrregiao.mesorregiao.UF.sigla,
                        nm_sigla: item.microrregiao.mesorregiao.UF.nome + ' - ' + item.microrregiao.mesorregiao.UF.sigla
                      }));
                    } else {
                      this.estados = [{
                        sigla: response.data.microrregiao.mesorregiao.UF.sigla,
                        nm_sigla: response.data.microrregiao.mesorregiao.UF.nome + ' - ' + response.data.microrregiao.mesorregiao.UF.sigla
                      }];
                    }
                  })
                  .catch(error => {
                    console.error('Erro ao obter cidades:', error);
                    return [];
                  });
            } else {
              // Se não há cidade, retorna a lista de estados
              this.estados = estados.map(item => ({
                sigla: item.sigla,
                nm_sigla: item.nome + ' - ' + item.sigla
              }));
            }
          })
          .catch(error => {
            console.error('Erro ao obter estados:', error);
            return [];
          });
    }
  }
}
</script>
