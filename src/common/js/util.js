export function shuffle (arr) {
  const _arr = arr.slice() // 创建一个副本，解决会同时修改传入的arr的问题，因为原来是引用
  for (let i = 0; i < _arr.length; i++) {
    const j = getRandomInt(0, i)
    const t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
