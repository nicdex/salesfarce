import uuid from 'uuid';
import SalesLead from '../domain/SalesLead';
import ReceiveSalesLead from '../commands/ReceiveSalesLead';

export default class SalesLeadController {
  constructor(app, readRepository, commandHandler, logger) {

    function receiveSalesLead(req, res) {
      //TODO: validate req.body input
      const command = new ReceiveSalesLead(req.body);
      command.salesLeadId = uuid.v4();
      commandHandler(command.salesLeadId, new SalesLead(), command)
          .then(() => {
            res.json(command);
          })
          .catch(err => {
            logger.error(err);
            res.status(500).json(err);
          });
    }

    app.post('/api/v1/salesLead/receive', receiveSalesLead);

    function getAllSalesLead(req, res) {
      readRepository.findAll('salesLeads')
          .then(results => {
            res.json(results);
          })
          .catch(err => {
            logger.error(err);
            res.status(500).json(err);
          });
    }

    app.get('/api/v1/salesLead', getAllSalesLead);
  }
}