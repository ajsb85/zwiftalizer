export function setUserPreferences(prefs) {

  localStorage.currentUserPreferences = JSON.stringify(prefs)

  return prefs
}

export function getUserPreferences() {

  if (!localStorage.currentUserPreferences) {
    return undefined;
  }

  return JSON.parse(localStorage.currentUserPreferences)
}
