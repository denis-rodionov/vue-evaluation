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

      <v-toolbar-title>
        {{ loaded ? menuItems[selectedItem].text : "Undefined" }}
      </v-toolbar-title>

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

        <template v-for="(_, entityName) in menuItems">
          <EntityForm
            :key="entityName + editFormKey"
            v-if="selectedItem === entityName"
            :updatingObject="updatingItem"
            :update="update"
            :schema="schema[entityName]"
            :entityDisplayName="menuItems[entityName].text"
            :validationErrors="validationErrors"
            @close="closeDialog"
            @save="onDialogSave($event)"
            @update="onDialogUpdate($event)"
          />
        </template>
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
      <v-dialog
        v-model="deletionConfirmDialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            Delete item?
          </v-card-title>

          <v-card-text>
            Are you sure you want to delete the selected item of 
            {{ selectedItem }}?
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="deletionConfirmDialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              @click="onItemDeletionConfirmed"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <v-row>
          <v-col
            cols="12"
          >
            <v-card>
              <template v-for="(_, entityName) in menuItems">
                <EntityList
                  :key="entityName"
                  v-if="selectedItem === entityName"
                  :itemList="menuItems[entityName].list" 
                  :schema="schema[entityName]"
                  @update="onItemUpdate($event)"
                  @delete="onItemDelete($event)"
                />
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import SchemaService from './services/SchemaService';
  import shared from './lib/shared.js'
  import EntityList from './components/EntityList'
  import EntityForm from './components/EntityForm'
import { ref } from 'vue';

  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  export default {
    components: {
      EntityForm, EntityList
    },
    data: () => ({ 
      drawer: true,
      selectedItem: null,
      selectedItemIndex: 0,   // shortcut to set initial selected menu item
      deletionConfirmDialog: false,
      deletingItem: null,
      menuItems: {},
      mockItems: {
        cultivation: { text: 'Cultivation', icon: 'mdi-compost', list: [
          { plotname: "green", fieldsize: 16, variety: "sdf asdf sd fgn sdflgdsf", vines_sum: 3, action_done: "none", issues: false},
          { plotname: "yelow", fieldsize: 55, variety: "sdf asdf sd fgn sdflgdsf", vines_sum: 3, action_done: "none", issues: false},
          { plotname: "blue", fieldsize: 253, variety: "sdf asdf sd fgn sdflgdsf", vines_sum: 3, action_done: "none", issues: false}
        ]},
        fluid_storage: { text: 'Fluid Storage', icon: 'mdi-database', list: [
          { tankame: "Trsef", maxvolume_in_l: 32 },
          { tankame: "Ufnee", maxvolume_in_l: 34 }
        ] },
        fluid_storage_content: { text: 'Fluid Storage Contents', icon: 'mdi-blur-radial', list: [
          { variety: "Balaf", year: "2002", is_volume_in_l: 2, action_done: "None" },
          { variety: "feeedddff", year: "2002", is_volume_in_l: 2, action_done: "None" }
        ] },
        vinification_material: { text: 'Vinification Products', icon: 'mdi-glass-wine', list: [
          { kind_of_product: "fweffsdf", producer: "fsfff", lot_number: "20L", amount_in_x: "233f"},
          { kind_of_product: "fdffws", producer: "fsfff", lot_number: "20L", amount_in_x: "233f"},
          { kind_of_product: "hgrr", producer: "fsfff", lot_number: "20L", amount_in_x: "233f"}
        ] },
        lab_values: { text: 'Lab Values', icon: 'mdi-flask-empty', list: [
          { sample_name: "t1", free_so2: 223, total_so2: 555, p_h: 2, sugar: 1.3, value_ntu: 23, density: 234, alcohol: 10, notes: "good", harvest: true, default_analyse: false, decision_needed: true},
          { sample_name: "t2", free_so2: 223, total_so2: 555, p_h: 2, sugar: 1.3, value_ntu: 23, density: 234, alcohol: 10, notes: "good", harvest: true, default_analyse: false, decision_needed: true},
          { sample_name: "t3", free_so2: 223, total_so2: 555, p_h: 2, sugar: 1.3, value_ntu: 23, density: 234, alcohol: 10, notes: "good", harvest: true, default_analyse: false, decision_needed: true}
        ] },
        equipment_general: { text: 'Equipment', icon: 'mdi-scale', list: [
          { kind_of_equipment: "fsdf", producer: "fff", serial_number: "2sdffdf", cost_action: "3dsdf", date: "27 November 2022", broken: false },
          { kind_of_equipment: "3fsdf", producer: "fff", serial_number: "34gws", cost_action: "3dsdf", date: "27 November 2022", broken: false },
          { kind_of_equipment: "23ff", producer: "fff", serial_number: "gfw333", cost_action: "3dsdf", date: "27 November 2022", broken: false }
        ] },
        bottling: { text: 'Bottling Report', icon: 'mdi-bottle-tonic', list: [
          { kind_of_product: "ewdf1", source_tank: "sdhhn1", lot_number: "356d1", amount_in_x: "g33" },
          { kind_of_product: "ewdf2", source_tank: "sdhhn2", lot_number: "356d2", amount_in_x: "g33" },
          { kind_of_product: "ewdf3", source_tank: "sdhhn3", lot_number: "356d3", amount_in_x: "g33" }
        ] },
      },
      dialog: false,
      loaded: false,
      updatingItem: {},   // for updating object
      update: false,      // if true, the form is used for update
      editFormKey: ref(0),
      validationErrors: {},
      error: "",
      successMessage: false,
      schema: {},
      schemaMock: {
        bottling: {
          url:"/bottlings",
          persistence:{
            type: "document"
          },
          model_name: "bottling",
          dynamic_attributes: [
          {
            method_name: "kind_of_product",
            definition_name: "kind_of_product",
            validators:[
               {
                  type:"presence"
               }
            ],
            labels:{
               en: "name of product",
               de: "Name des Produkts"
            },
            default_value: null,
            type: "text"
          },
          {
            method_name: "source_tank",
            definition_name: "source_tank",
            validators: [
               {
                  type:"presence"
               }
            ],
            labels:{
               en:"source tank",
               de:"Quelltank"
            },
            default_value:null,
            type:"text"
          },
          {
            method_name: "lot_number",
            definition_name: "lot_number",
            validators: [
               {
                  type: "presence"
               }
            ],
            labels:{
               en:"Bottling/Labeling date",
               de:"Chargennummer"
            },
            default_value:null,
            type: "text"
          },
          {
            method_name: "amount_in_x",
            definition_name: "amount_in_X",
            validators:[
               {
                  "type":"presence"
               }
            ],
            labels:{
               en:"amount in pieces",
               de:"Menge StÃ¼ck"
            },
            default_value:null,
            type:"text"
          }
          ],
          labels:{
            en: "Bottling/Labeling Report",
            de: "AbfÃ¼ll/Label Report"
          }
        }
      }
    }),
    methods: {
      async onDialogSave(event) {
        const entity = this.selectedItem;
        console.log(`Saving ${entity} ${JSON.stringify(event)}`);
        try {
          const response = await this.schemaService.createEntity(event, entity);
          if (response['error'] == "Validation Error") {
            this.validationErrors = {};
            for (const valErr of response['messages']) {
              this.validationErrors[valErr.definition_name] = valErr.error_message;
            }
            this.rerenderForm();
          } else {
            this.menuItems[entity].list.push(response);
            await this.showSuccessMessage(`${entity} object is saved!`) 
            this.closeDialog();
          }
        }
        catch (err) {
          this.closeDialog();
          await this.showError(`Could not create an item: ${JSON.stringify(err)}`)
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
      rerenderForm() {
        this.editFormKey++;
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
          
          let menuItem = {};
          menuItem.list = await this.schemaService.getItems(entityName);
          
          if (this.schema[entityName].labels.en) {
            menuItem.text = shared.capitalize(this.schema[entityName].labels.en);
          } else {
            throw new Error(`Could not load ${entityName}: labels.en is empty!`);
          }
          console.log(`DEBUG: ${menuItem.text}`);
          menuItem.icon = 'mdi-database';
          this.menuItems[entityName] = menuItem;
        }
        catch (error) {
          this.showError(`Could not load ${entityName}: ${error}`)
        }
      },
      async onItemUpdate(event) {
        console.log(`On update: ${JSON.stringify(event)}`);
        this.showUpdateDialog(event);
      },
      async onItemDelete(event) {
        console.log(`On delete ${JSON.stringify(event)}`);
        this.deletionConfirmDialog = true;
        this.deletingItem = event;
      },
      async onItemDeletionConfirmed() {
        console.log(`Item deletion is confirmed: ${JSON.stringify(this.deletingItem)}`);
        this.deletionConfirmDialog = false;
        try {
          await this.schemaService.deleteEntity(this.deletingItem, this.selectedItem);
          await this.showSuccessMessage(`Entity ${this.selectedItem} was deleted: ${this.deletingItem}`)
        } catch (error) {
          await this.showError(`Could not delete the object: ${error}`)
        }
        this.deletingItem = null;
      },
      closeDialog() {
        this.dialog = false;
        this.update = false;
        this.updatingItem = {};
        this.validationErrors = {};
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
        this.schema = await this.schemaService.get_schema();
        for (const [entityName] of Object.entries(this.schema)) {
          if (!this.selectedItem) {
            this.selectedItem = entityName;
            //console.logs(`${JSON.stringify(this.menuItems)}`);
          }
          console.log(`Loading entity ${entityName}...`);
          await this.loadItems(entityName);
        }
        console.log("LOADED");
        this.loaded = true;
      }
      catch (error) {
        this.showError(`Error during page initialisation: ${error}`)
      }
    },

    errorCaptured(err) {
      this.showError(err.message);
    }
  }
</script>