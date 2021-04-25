function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  module.export = {
    isNumber
  }