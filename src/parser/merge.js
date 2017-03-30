var _ = require('underscore');

export default function merge(arr1, arr2) {
  const result = [];

  _.each(arr1, arr1point => {
    const clonedPoint = _.clone(arr1point);

    var arr2point = _.find(arr2, point => {
      return point[0] === clonedPoint[0];
    });

    if (arr2point) {
      clonedPoint[1] = arr2point[1];
    }

    result.push(clonedPoint);
  });

  return result;
}
