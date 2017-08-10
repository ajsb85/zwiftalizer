export const SET_SELECTED_TAB = 'SET_SELECTED_TAB';

export function setSelectedTab(selectedTab, tabNamespace) {
  return {
    type: SET_SELECTED_TAB,
    tab: selectedTab,
    namespace: tabNamespace
  };
}
