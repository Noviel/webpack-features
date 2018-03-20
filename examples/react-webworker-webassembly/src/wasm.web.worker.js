import wasm from './add.wasm';

wasm().then(module => {
  const fn = module.instance.exports;
  console.log(fn.add_one(420));
});
