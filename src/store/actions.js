// 一次操作中修改多个mutation就会定义一个action进行封装
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({ state, commit }, { list, index }) {
  const copyList = list.slice()
  commit(types.SET_SEQUENCE_LIST, copyList)
  if (state.mode === playMode.random) {
    const randomlist = shuffle(copyList)
    commit(types.SET_PLAYLIST, randomlist)
    index = findIndex(randomlist, copyList[index])
  } else {
    commit(types.SET_PLAYLIST, copyList)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({ commit }, { list }) {
  const copyList = list.slice()
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, copyList)
  const randomlist = shuffle(copyList)
  commit(types.SET_PLAYLIST, randomlist)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
