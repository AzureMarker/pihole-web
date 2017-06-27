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

// Credit: http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript/4835406#4835406
export let escapeHtml = (text) => {
  let map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
};