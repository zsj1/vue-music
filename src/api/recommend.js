import jsonp from 'common/js/jsonp'
import axios from 'axios'
import { commonParams, options } from './config'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getDiscList () { // 这里为了解决QQ音乐的这个jsonp设置的host和referer的限制（前端发起请求无法修改headers中的这些参数），所以用后端发起请求，
  const url = '/api/getDiscList'

  // const data = Object.assign({}, commonParams, {
  //   platform: 'yqq',
  //   hostUin: 0,
  //   sin: 0,
  //   ein: 29,
  //   sortId: 5,
  //   needNewCode: 0,
  //   categoryId: 10000000,
  //   rnd: Math.random(),
  //   format: 'json'
  // })
  // 新的获取方法
  const e = 'recom' + (Math.random() + '').replace('0.', '')
  const d = '{"comm":{"ct":24},"playlist":{"method":"get_playlist_by_category","param":{"id":3317,"curPage":1,"size":40,"order":5,"titleid":3317},"module":"playlist.PlayListPlazaServer"}}'
  const data = {
    '-': e,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: d
  }

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// export function getSongList (disstid) {
//   const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

//   const data = Object.assign({}, commonParams, {
//     disstid,
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     platform: 'yqq',
//     hostUin: 0,
//     needNewCode: 0
//   })

//   return jsonp(url, data, options)
// }

// 新的获取函数
export function getSongList (tid) {
  const url = `/api/getDiscSongList/${tid}`
  const data = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid: tid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
