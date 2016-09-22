var utils = require('./utils');

module.exports = function commandHandlerFactory (goesClient, logger) {
  function readStream(aggregateId) {
    return new Promise(function (resolve, reject) {
      var start = Date.now();
      goesClient.readStream(aggregateId, function (err, events) {
        logger.info('readStream', aggregateId, 'took', Date.now()-start, 'ms');
        if (err) {
          logger.error(err, 'Failed to read stream for aggregateId', aggregateId);
          return reject(err);
        }
        resolve(events);
      });
    });
  }

  function addEvent(aggregateId, expectedVersion, event, metadata) {
    return new Promise(function (resolve, reject) {
      var start = Date.now();
      goesClient.addEvent(aggregateId, expectedVersion, event, metadata || {}, function (err) {
        logger.info('addEvent', aggregateId, utils.getTypeName(event), 'took', Date.now()-start, 'ms');
        if (err) {
          logger.error(err, 'Failed to add event to aggregateId', aggregateId);
          return reject(err);
        }
        return resolve();
      });
    });
  }

  return function commandHandler (aggregateId, aggregate, command, metadata, create) {
    if (!create && typeof metadata === 'boolean') {
      create = metadata;
      metadata = null;
    }
    var start = Date.now();
    metadata = metadata || {};
    metadata.timestamp = start;

    return (create ? Promise.resolve([]) : readStream(aggregateId))
        .then(function (events) {
          events
            .map(ev => ev.event)
            .forEach(aggregate.hydrate);
          return events.length;
        })
        .then(function (expectedVersion) {
          return {
            event: aggregate.execute(command),
            expectedVersion: expectedVersion
          };
        })
        .then(function (data) {
          return addEvent(aggregateId, data.expectedVersion, data.event, metadata);
        })
        .then(function (result) {
          logger.info('Processing command', utils.getTypeName(command), JSON.stringify(command), "create="+create, 'took', Date.now()-start, 'ms');
          return result;
        });
  };
};