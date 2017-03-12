var _ = require('underscore')

export default function titleCase(str) {

  const exceptions = ['PC', 'AMD', 'ATi', 'OpenGL', 'SRM', 'iBike', 'MiPulse', 'Saris/CycleOps/PowerTap', 'QUBO', 'Drivo/Kura']

  var titleCaseStr = str.replace(/([^\W_]+[^\s-]*) */g, s => {
    return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase()
  });

  _.each(exceptions, ex => {
    titleCaseStr = titleCaseStr.replace(new RegExp('\\b' + ex + '\\b', 'gi'), ex)
  })

  return titleCaseStr
}
