export default {
  state: {
    task_id: '',//模板id
    task_operation: ''
  },
  mutations: {
    setTaskId(state, id) {
      state.task_id = id
    },
    setTaskOperation(state, operation) {
      state.task_operation = operation
    },
    resetTaskData(state) {
      state.task_id = '';
      state.task_operation = '';
    }
  }
}
