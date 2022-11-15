<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
    <v-list dense>
      <v-subheader>NAVIGATION</v-subheader>
      <v-list-item-group
        color="cyan"
        v-model="selectedItemIndex"
      >
        <v-list-item
          v-for="(value, entityName) in menuItems" 
          :key="entityName"
          @click="selectedItem = entityName"
        >
          <v-list-item-icon>
            <v-icon v-text="value.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="value.text"></v-list-item-title>
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
      @input="onDialogInput($event)"
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

        <CultivationForm 
          v-if="selectedItem === 'cultivation'"
          :updatingObject="updatingItem"
          :update="update"
          @close="closeDialog"
          @save="onDialogSave($event)"
          @update="onDialogUpdate($event)"
        />
        <FluidStorageForm 
          v-if="selectedItem === 'fluid_storage'"
          :updatingObject="updatingItem"
          :update="update"
          @close="closeDialog"
          @save="onDialogSave($event)"
          @update="onDialogUpdate($event)"
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
        class="py-8 px-6"
        fluid
      >
        <v-row>
          <v-col
            cols="12"
          >
            <v-card>
              <CultivationList 
                v-if="selectedItem === 'cultivation'"
                :itemList="menuItems['cultivation'].list" 
                @update="onItemUpdate($event)"
                @delete="onItemDelete($event)"
              />
              <FluidStorageList 
                v-if="selectedItem === 'fluid_storage'"
                :itemList="menuItems['fluid_storage'].list" 
                @update="onItemUpdate($event)"
                @delete="onItemDelete($event)"
              />
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
  import FluidStorageList from './components/FluidStorageList'
  import FluidStorageForm from './components/FluidStorageForm'

  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  export default {
    components: {
      CultivationForm, CultivationList, FluidStorageList, FluidStorageForm
    },
    data: () => ({ 
      drawer: true,
      selectedItem: 'cultivation',
      selectedItemIndex: 0,   // shortcut to set initial selected menu item
      menuItems: {
        cultivation: { text: 'Cultivation', icon: 'mdi-compost', list: [
          { plotname: "green", fieldsize: 16, variety: "sdf asdf sd fgn sdflgdsf", vines_sum: 3, action_done: "none", issues: false},
          { plotname: "yelow", fieldsize: 55, variety: "sdf asdf sd fgn sdflgdsf", vines_sum: 3, action_done: "none", issues: false},
          { plotname: "blue", fieldsize: 253, variety: "sdf asdf sd fgn sdflgdsf", vines_sum: 3, action_done: "none", issues: false}
        ]},
        fluid_storage: { text: 'Fluid Storage', icon: 'mdi-database', list: [
          { tankame: "Trsef", maxvolume_in_l: 32 },
          { tankame: "Ufnee", maxvolume_in_l: 34 }
        ] },
        fluid_storage_content: { text: 'Fluid Storage Content', icon: 'mdi-blur-radial' },
        vinification_material: { text: 'Vinification Material', icon: 'mdi-glass-wine' },
        lab_values: { text: 'Lab Values', icon: 'mdi-flask-empty' },
        equipment_general: { text: 'Equipment General', icon: 'mdi-scale' },
        bottling: { text: 'Bottling', icon: 'mdi-bottle-tonic' },
      },
      dialog: false,
      updatingItem: {},   // for updating object
      update: false,      // if true, the form is used for update
      error: "",
      successMessage: false
    }),
    methods: {
      async onDialogSave(event) {
        const entity = this.selectedItem;
        console.log(`Saving ${entity} ${JSON.stringify(event)}`);
        this.closeDialog();
        try {
          const createdObject = await this.schemaService.createEntity(event, entity);
          this.menuItems[entity].list.push(createdObject);
          await this.showSuccessMessage(`${entity} object is saved!`) 
        }
        catch (error) { 
          await this.showError(`Could not create an item: ${error}`)
        }
      },
      async onDialogUpdate(event) {
        const entity = this.selectedItem;
        console.log(`Updating object ${JSON.stringify(event)}`);
        this.closeDialog();
        try {
          await this.schemaService.updateEntity(event, entity);
          await this.showSuccessMessage(`${entity} object is updated!`);
        }
        catch (error) {
          await this.showError(`Could not update the object: ${error}`)
        }
      },
      async showError(errorText) {
        this.error = errorText;
        await sleep(10000);
        this.error = "";
      },
      async showSuccessMessage(message) {
        this.successMessage = message;
        await sleep(5000);
        this.successMessage = "";
      },
      async loadItems(entityName) {
        try {
          this.menuItems[entityName].list = await this.schemaService.getItems(entityName);
        }
        catch (error) {
          this.showError(`${error}`)
        }
      },
      async onItemUpdate(event) {
        console.log(`On update: ${JSON.stringify(event)}`);
        this.showUpdateDialog(event);
      },
      async onItemDelete(event) {
        const entity = this.selectedItem;
        console.log(`On delete ${entity}: ${JSON.stringify(event)}`);
        try {
          await this.schemaService.deleteEntity(event, entity);
          await this.showSuccessMessage(`Entity ${entity} was deleted: ${event}`)
        } catch (error) {
          await this.showError(`Could not delete the object: ${error}`)
        }
      },
      closeDialog() {
        this.dialog = false;
        this.update = false;
        this.updatingItem = {};
      },
      showUpdateDialog(updatingItem) {
        this.updatingItem = updatingItem;
        this.dialog = true;
        this.update = true;
      },
      onDialogInput(event) {
        console.log(`On dialog input: ${event}, ${this.dialog}`)
        if (!event) {
          this.closeDialog();
        }
      }
    },

    async created() {
      this.schemaService = new SchemaService();
      
      try {
        await this.schemaService.init();
        await this.loadItems('cultivation');
        await this.loadItems('fluid_storage');
      }
      catch (error) {
        this.showError(`${error}`)
      }
    }
  }
</script>