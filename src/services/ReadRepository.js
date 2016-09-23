function filter(rows, constraints) {
  if (!constraints) {
    return rows;
  }
  var filters = Object.getOwnPropertyNames(constraints).map(function (field) {
    var value = constraints[field];
    if (Array.isArray(value)) {
      return function(x) {
        return value.indexOf(x[field]) >= 0;
      }
    }
    return function (x) {
      return x[field] === value;
    }
  });
  return filters.reduce(function (results, f) {
    return results.filter(f);
  }, rows);
}

function DependencyProvider(dependencies, values) {
  if (!Array.isArray(dependencies)) {
    throw new TypeError('Parameter dependencies must be an array.');
  }
  if (!Array.isArray(values)) {
    throw new TypeError('Parameter values must be an array.');
  }
  if (dependencies.length !== values.length) {
    throw new Error('Parameter dependencies and values must have same length.');
  }
  this.get = function (modelName, constraints) {
    var index = dependencies.indexOf(modelName);
    if (index < 0) {
      throw new Error('Dependency missing: ' + modelName);
    }
    return filter(values[index], constraints);
  };
}

function ReadRepository(goesReader, logger) {
  var models = {};
  var self = this;

  this.define = function (modelName, model) {
    if (!model) {
      throw new Error('model parameter is missing.');
    }
    if (!model.reducer || !model.filters) {
      throw new TypeError('model MUST have reducer and filters properties.');
    }
    logger.info('Defining model:', modelName);
    models[modelName] = model;
  };

  function getAllFor(filters) {
    return new Promise(function (resolve, reject) {
      goesReader.getAllFor(filters, function (err, events) {
        if (err) {
          return reject(err);
        }
        resolve(events);
      });
    });
  }

  function build(modelName) {
    var model = models[modelName];
    if (!model) {
      return Promise.reject(new Error(['Model "', modelName, '" is not defined.'].join('')));
    }
    var dependencies = model.dependencies || [];
    logger.info('Building read model', modelName, model);
    return Promise
        .all(dependencies.map(function (dep) {
          return self.findAll(dep);
        }))
        .then(function (args) {
          return new DependencyProvider(dependencies, args);
        })
        .then(function (dependencyProvider) {
          return getAllFor(model.filters)
              .then(function (events) {
                return events.reduce(model.reducer.bind(dependencyProvider), []);
              });
        });
  }

  this.findOne = function (modelName, constraints, noThrowOnError) {
    var start = Date.now();
    return build(modelName)
        .then(function (rows) {
          return filter(rows, constraints);
        })
        .then(function (rows) {
          if (noThrowOnError || rows.length === 1) {
            return rows[0];
          }
          if (rows.length === 0) {
            var error = new Error('No result found for: ' + modelName);
            error.code = [modelName, 'no-result-found'].join('/');
            throw error;
          }
          throw new Error('More than one result found for: ' + modelName);
        })
        .then(function (result) {
          logger.info('findOne', modelName, JSON.stringify(constraints), 'took', Date.now()-start, 'ms');
          return result;
        });
  };

  this.findAll = function (modelName) {
    var start = Date.now();
    return build(modelName)
      .then(function (result) {
        logger.info('findAll', modelName, 'took', Date.now()-start, 'ms');
        return result;
      });
  };

  this.findWhere = function (modelName, constraints) {
    var start = Date.now();
    return build(modelName)
        .then(function (rows) {
          return filter(rows, constraints);
        })
        .then(function (result) {
          logger.info('findWhere', modelName, JSON.stringify(constraints), 'took', Date.now()-start, 'ms');
          return result;
        });
  };
}

module.exports = ReadRepository;