// define a mixin object
export default {
    props: ['itemList'],
    emits: ['update', 'delete'],
    data: () => ({
    }),
    created() {
      console.log(`List created: ${this.itemList}`)
    }
}