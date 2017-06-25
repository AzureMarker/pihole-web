export let padNumber = (num) => {
  return ("00" + num).substr(-2,2);
};

export let parseObjectForGraph = (p) => {
  let keys = Object.keys(p);
  keys.sort(function(a, b) {
    return a - b;
  });

  let arr = [], idx = [];
  for(let i = 0; i < keys.length; i++) {
    arr.push(p[keys[i]]);
    idx.push(keys[i]);
  }

  return [idx,arr];
};