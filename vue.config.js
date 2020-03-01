const path = require('path')
const axios = require('axios')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // build: {
  //   port: 9000
  // },
  //   css: {
  //     loaderOptions: {
  //       stylus: {
  //         'resolve url': true,
  //         import: [
  //           './src/theme'
  //         ]
  //       }
  //     }
  //   },
  devServer: {
    before (app) {
      app.get('/api/getDiscList', function (req, res) {
        // 新的url
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            referer: 'https://y.qq.com/portal/search.html',
            'Sec-Fetch-Mode': 'cors',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
          },
          // headers: {
          //   referer: 'https://c.y.qq.com/',
          //   host: 'c.y.qq.com'
          // },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/getDiscSongList/:tid', function (req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            referer: `https://y.qq.com/n/yqq/playlist/${req.params.tid}.html`,
            'Sec-Fetch-Mode': 'cors',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
          },
          // headers: {
          //   referer: 'https://c.y.qq.com/',
          //   host: 'c.y.qq.com'
          // },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/lyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data
          // 把jsonp返回的值处理为json，其实可以直接用format的
          if (typeof ret === 'string') {
            const reg = /^\w+\(({[^()]+})\)$/
            const matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/search', function (req, res) {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
        axios.get(url, {
          params: req.query,
          headers: {
            Origin: 'https://y.qq.com',
            referer: 'https://y.qq.com/portal/search.html',
            'Sec-Fetch-Mode': 'cors',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/songList/:name', function (req, res) {
        // const url = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?p=1&n=10&w=${req.params.name}`
        const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
        axios.get(url, {
          params: {
            w: req.params.name,
            p: 1,
            n: 30,
            format: 'json'
          },
          headers: {
            Origin: 'https://y.qq.com',
            referer: 'https://y.qq.com/portal/search.html',
            'Sec-Fetch-Mode': 'cors',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/song/:mid', function (req, res) {
        const url = `https://u.y.qq.com/cgi-bin/musicu.fcg?data={"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"703417739","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"703417739","songmid":["${req.params.mid}"],"songtype":[0],"uin":"","loginflag":1,"platform":"20"}},"comm":{"uin":"","format":"json","ct":24,"cv":0}}`
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            referer: 'https://y.qq.com/portal/search.html',
            'Sec-Fetch-Mode': 'cors',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
    }
  },
  chainWebpack (config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
  }
}
