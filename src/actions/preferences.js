export const SET_PREFERENCES = 'SET_PREFERENCES'

export function setPreferences(data) {

  console.log('setPreferences')
  console.log(data)

  localStorage.preferences = JSON.stringify(data)

  return {
    type: SET_PREFERENCES,
    data
  }
}
