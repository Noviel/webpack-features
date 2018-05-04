const ctx: any = self;

ctx.onmessage = function(event: any) {
  const array = event.data.data;
  let result = 0;
  let i = 0;
  console.log('TS Worker has started calculations...');
  while (i < 1e7) {
    result = array.reduce((acc: any, curr: any) => acc + curr + i, 0);
    i++;
  }

  ctx.postMessage(result);
};

console.log('TS Worker was loaded...');
