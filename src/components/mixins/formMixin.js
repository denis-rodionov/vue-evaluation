// define a mixin object
export default {
    props: ['updatingObject', 'update'],
    emits: ['close', 'save', 'update'],
    methods: {
        onClose() {
          console.log("Component on close...")
          this.mutatedObject = {};
          this.$emit('close');
        },
        onUpdate() {
          this.$emit('update', this.mutatedObject);
          this.mutatedObject = {};
        },
        onSave() {
          this.$emit('save', this.mutatedObject);
          this.mutatedObject = {};
        },
        onStateChanged() {
          console.log(`State changed: ${JSON.stringify(this.updatingObject)}`)
          this.mutatedObject = this.updatingObject;
        }
      },
    created() {
        this.onStateChanged();
    },
    beforeUpdate() {
        this.onStateChanged();
    }
}