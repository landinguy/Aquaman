import { lablelQuery,lablelBind,lablelTemplates,lablelTemplateCount,lablelDelete } from "@/api/label"
import {str2time} from "@/libs/timeUitls";

export default {
  state: {
    oneLevels:[],
    twoLevels:[],
    templateList:[],
    templatesNo:0

  },
  mutations: {
    setOneLevels (state, oneLevels) {
      state.oneLevels = oneLevels;
    },
    setTwoLevels (state, twoLevels) {
      state.twoLevels = twoLevels;
    },
    setTemplateList (state, templateList) {
      var newList = [];
      for(var i = 0; i < templateList.length; i++){
        var tag = "";
        templateList[i].createTs = str2time(templateList[i].createTs);
        templateList[i].updateTs = str2time(templateList[i].updateTs);
        if(templateList[i].tags == null){
          newList.push(templateList[i])
          continue;
        }
        else
        {
          for(var j = 0; j < templateList[i].tags.length; j++){
            tag += templateList[i].tags[j].label + " ";
          }
          templateList[i].tag = tag;
          newList.push(templateList[i])
        }
      }
      state.templateList = newList;
    },
    setTemplatesNo (state, templatesNo) {
      state.templatesNo = templatesNo;
    },
  },

  actions: {

    handleLablelQuery({commit}, {level, pids }) {
      return new Promise((resolve, reject) => {
        lablelQuery({level, pids }).then(res => {
          if(level == 1){
            const oneLevels = res.data;
            commit('setOneLevels', oneLevels)
          }
          else if(level == 2){
            const twoLevels = res.data;
            commit('setTwoLevels', twoLevels)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleLablelBind({commit}, {tmplId, templateName, tagIds}) {
      return new Promise((resolve, reject) => {
        lablelBind({
          tmplId, templateName, tagIds
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleLablelTemplates({commit}, {templateName, createTsStart,createTsEnd,pageNo, pageSize}) {
      return new Promise((resolve, reject) => {
        lablelTemplates({
          templateName, createTsStart,createTsEnd,pageNo, pageSize
        }).then(res => {
          commit('setTemplateList', res.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleLablelTemplateCount({commit}, {templateName, createTsStart,createTsEnd}) {
      return new Promise((resolve, reject) => {
        lablelTemplateCount({
          templateName, createTsStart,createTsEnd
        }).then(res => {
          const templatesNo = res.data;
          commit('setTemplatesNo', templatesNo)
          resolve(res)
        }).catch(err => {
          commit('setTemplatesNo', 2)
          reject(err)
        })
      })
    },
    handleLablelDelete({commit}, {tmplId}) {
      return new Promise((resolve, reject) => {
        lablelDelete({
          tmplId
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

  }
}
