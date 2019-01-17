import { channelStatisticsCount,channelStatisticsList } from '@/api/channel'
export default {
  state: {
    channelStatisticsCount:0,
    channelStatisticsList:[],

  },
  mutations: {
    setChannelStatisticsCount (state, channelStatisticsCount) {
      state.channelStatisticsCount = channelStatisticsCount;
    },
    setChannelStatisticsList (state, channelStatisticsList) {
      state.channelStatisticsList = channelStatisticsList;
    },
  },

  actions: {
    handleChannelStatisticsCount({commit}, {st, et, channelNo, accountId ,userName,msgType,serviceType}) {
      return new Promise((resolve, reject) => {
        channelStatisticsCount({st, et, channelNo, accountId ,userName,msgType,serviceType}).then(res => {
          commit('setChannelStatisticsCount', res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleChannelStatisticsList({commit}, {st, et, channelNo, accountId,page,pageSize,userName,msgType,serviceType}) {
      return new Promise((resolve, reject) => {
        channelStatisticsList({st, et, channelNo, accountId, page, pageSize ,userName,msgType,serviceType}
        ).then(res => {
          const dic={
            SUPER:'超信',
            SIMPLE:'短信',
            SERVICE:'服务类',
            AD:'营销类',
            CAPTCHA:'验证码'
          }
          if(res.data.length > 0){
             for(var i=0; i<res.data.length;i++){
               var sType="";
               var serviceType = res.data[i].serviceType;
               if(serviceType.length>0){
                  for(var j=0; j < serviceType.length;j++){
                    sType += dic[serviceType[j]]+','
                  }
                  sType = sType.substr(0,sType.length-1);
                 res.data[i].serviceType = sType;
               }
               var mType="";
               var msgType = res.data[i].msgType;
               if(msgType.length>0){
                 for(var k=0; k<msgType.length; k++){

                   mType += dic[msgType[k]]+','
                 }
                 mType = mType.substr(0,mType.length-1);
                 res.data[i].msgType = mType;
               }
             }

          }
          commit('setChannelStatisticsList', res.data);
          resolve(res);
        }).catch(err => {
          reject(err)
        })
      })
    },

  }
}
