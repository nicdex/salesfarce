import ReceiveSalesLead from '../commands/ReceiveSalesLead';
import SalesLeadReceived from '../events/SalesLeadReceived';
import ContactSalesLead from '../commands/ContactSalesLead';
import SalesLeadContacted from '../events/SalesLeadContacted';

export default class SalesLead {
  constructor() {
    this._salesLeadId = null;
    this._contacted = false;
  }

  hydrate(evt) {
    if (evt instanceof SalesLeadReceived) {
      this._onSalesLeadReceived(evt);
    }
    else if (evt instanceof SalesLeadContacted) {
      this._onSalesLeadContacted(evt);
    }
  }

  _onSalesLeadReceived(evt) {
    this._salesLeadId = evt.salesLeadId;
  }

  _onSalesLeadContacted(evt) {
    this._contacted = true;
  }

  execute(command) {
    if (command instanceof ReceiveSalesLead) {
      return this._receive(command);
    }
    if (command instanceof ContactSalesLead) {
      return this._contact(command);
    }
    throw new Error('Unknown command.');
  }

  _receive(command) {
    if (this._salesLeadId) {
      throw new Error('SalesLead already exists.');
    }
    return new SalesLeadReceived({
      salesLeadId: command.salesLeadId,
      salesRepId: command.salesRepId,
      email: command.email,
      firstName: command.firstName,
      lastName: command.lastName,
      company: command.company,
      phone: command.phone,
      receivedAtDate: command.receivedAtDate
    });
  }

  _contact(command) {
    if (this._salesLeadId) {
      throw new Error('SalesLead doesn\'t exists.');
    }
    return new SalesLeadContacted({
      salesLeadId: command.salesLeadId,
      salesRepId: command.salesRepId,
      contactTime: command.contactTime
    });
  }
}