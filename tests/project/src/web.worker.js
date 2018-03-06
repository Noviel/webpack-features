onmessage = function(event) {
  const array = event.data.data;
  let result = 0;
  let i = 0;
  console.log('Worker has started calculations...');
  while (i < 1e7) {
    result = array.reduce((acc, curr) => acc + curr + i, 0);
    i++;
  }

  postMessage(result);
};

console.log('Worker was loaded...');
