export default {
  state: {
    id: '',//模板id
    operation: 'default',//模板查看、修改操作,
    materials: [],
    haveText: 0,
    index: null,
    extraParam: {
      type: '',
      txt: '',
      spaceUsage: 0
    },
  },
  mutations: {
    setId(state, id) {
      state.id = id
    },
    setOperation(state, operation) {
      state.operation = operation
    },
    setExtraParam(state, p) {
      state.extraParam.type = p.type;
      state.extraParam.txt = p.txt;
      state.extraParam.spaceUsage = p.spaceUsage;
    },
    delMat(state, index) {
      if (state.materials[index].mt == 'TEXT') {
        state.haveText--;
      }
      state.materials.splice(index, 1);
    },
    move(state, {index, up}) {
      let temp = state.materials[index];
      state.materials.splice(index, 1);
      if (up) {
        state.materials.splice(index - 1, 0, temp);
      } else {
        state.materials.splice(index + 1, 0, temp);
      }
    },
    updateMaterial(state, m) {
      if (state.index != null) {//编辑素材
        let obj = state.materials[state.index];
        console.log("current material ->" + JSON.stringify(obj));
        obj.mid = m.id;
        obj.mc = m.resource;
        obj.mt = m.type;
        obj.ms = m.spaceUsage;
        state.index = null;
      } else {
        state.materials.push({mid: m.id, mc: m.resource, mt: m.type, ms: parseFloat(m.spaceUsage)});
        if (m.type == "TEXT") {
          state.haveText++;
        }
      }
    },
    clearMaterial(state) {
      state.materials = [];
      state.haveText = 0;
    },
    resetTempData(state) {
      state.id = '';
      state.operation = 'default';
    }

  }
}
