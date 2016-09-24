export function getTypeName(obj) {
  if (obj && obj.constructor && obj.constructor.name) {
    return obj.constructor.name;
  }
  return typeof obj;
}

function newCall(Cls, args) {
  return new (Function.prototype.bind.apply(Cls, [Cls].concat(args)));
}

export function newInject(Cls, services) {
  const code = Cls.toString();
  const m = code.match(new RegExp(Cls.name + '\\(([^)]+)\\)'));
  if (!m || !m[1]) throw new Error('Couldn\'t parse class ' + Cls.name + ' constructor.');
  const params = m[1].split(',');
  const args = params.map(param => {
    const p = param.trim();
    return services[p];
  });
  return newCall(Cls, args);
}
