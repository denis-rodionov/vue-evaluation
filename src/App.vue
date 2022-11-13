<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
    <v-list dense>
      <v-subheader>NAVIGATION</v-subheader>
      <v-list-item-group
        v-model="selectedItem"
        color="cyan"
      >
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ menuItems[selectedItem].text }}</v-toolbar-title>

      <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-2"
            dark
            color="cyan"
            right
            fixed
            v-bind="attrs"
            v-on="on"
          >
            Create
          </v-btn>
        </template>

        <!-- form component menuItems[selectedItem].text -->
        <CultivationForm 
          v-if="selectedItem === 0"
          @close="dialog = false"
          @save="onDialogSave($event)"
        />

      </v-dialog>
    </v-app-bar>
    
    <v-main>
      <v-alert
        dismissible
        type="error"
        v-if="error"
      >{{ error }}</v-alert>
      <v-alert
        dismissible
        type="success"
        v-if="successMessage"
      >{{ successMessage }}</v-alert>
      <v-container
        v-if="selectedItem === 0"
        class="py-8 px-6"
        fluid
      >
        <v-row>
          <v-col
            cols="12"
          >
            <v-card>
              <CultivationList :itemList="cultivations" />
            </v-card>
          </v-col>
        </v-row>
        
      </v-container>

      
    </v-main>
  </v-app>
</template>

<script>
  import SchemaService from './services/SchemaService';
  import CultivationForm from './components/CultivationForm'
  import CultivationList from './components/CultivationList'

  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  export default {
    components: {
      CultivationForm, CultivationList
    },
    data: () => ({ 
      drawer: true,
      selectedItem: 0,
      menuItems: [
        { text: 'Cultivation', icon: 'mdi-flag' },
        { text: 'Fluid Storage', icon: 'mdi-flag' },
        { text: 'Fluid Storage Content', icon: 'mdi-flag' },
        { text: 'Vinification Material', icon: 'mdi-flag' },
        { text: 'Lab Values', icon: 'mdi-flag' },
        { text: 'Equipment General', icon: 'mdi-flag' },
        { text: 'Bottling', icon: 'mdi-flag' },
      ],
      cultivations: [
        { plotname: "green", fieldsize: 16, variety: "sdf asdf sd fgn sdflgdsf", vines_sum: 3, action_done: "none", issues: false},
        { plotname: "yelow", fieldsize: 55, variety: "sdf asdf sd fgn sdflgdsf", vines_sum: 3, action_done: "none", issues: false},
        { plotname: "blue", fieldsize: 253, variety: "sdf asdf sd fgn sdflgdsf", vines_sum: 3, action_done: "none", issues: false}
      ],
      dialog: false,
      error: "",
      successMessage: false
    }),
    methods: {
      async onDialogSave(event) {
        console.log(JSON.stringify(event));
        this.dialog = false;
        try {
          await this.schemaService.createCultivation(this.dialogObject);
          this.showSuccessMessage("Cultivation object is created!")
        }
        catch {
          await this.showError("Could not create an item. See console logs for more details")
        }
      },
      async showError(errorText) {
        this.error = errorText;
        await sleep(5000);
        this.error = "";
      },
      async showSuccessMessage(message) {
        this.successMessage = message;
        await sleep(5000);
        this.successMessage = "";
      }
    },

    async created() {
      this.schemaService = new SchemaService();
      
      try {
        await this.schemaService.init();
        this.cultivations = await this.schemaService.getCultivations();
      }
      catch (error) {
        this.showError(`${error}`)
      }
    }
  }
</script>