import axios from '@/libs/axios'
import url from './url'

export const channelStatisticsCount = ({ st, et, accountId,find,userName,msgType,serviceType }) => {
  const data = { st, et, accountId ,find,userName,msgType,serviceType}
  return axios.request({
    url:url.statisticsCount,
    data,
    method: 'post'
  })
}


export const channelStatisticsList = ({st, et, channelNo, accountId, page, pageSize ,userName,msgType,serviceType}) => {
  const data = {st, et, channelNo, accountId, page, pageSize ,userName,msgType,serviceType}
  return axios.request({
    url:url.channelStatsList,
    data,
    method: 'post'
  })
}

