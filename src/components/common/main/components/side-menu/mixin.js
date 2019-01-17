// import CommonIcon from '@/components/common/common/common-icon'
export default {
  // components: {
  //   CommonIcon
  // },
  methods: {
    showTitle (item) {
      return (item.meta && item.meta.title) || item.name
    },
    showChildren (item) {
      return item.children && item.children.length > 1
    }
  }
}
