export const filters = {
  eventType: ['SalesLeadReceived', 'SalesLeadContacted']
};

export function reducer(salesLeads, eventData) {
  const event = eventData.event;
  const metadata = eventData.metadata;
  switch(eventData.typeId) {
    case 'SalesLeadReceived':
      salesLeads.push({
        //TODO: create view instance here
      });
      break;
    case 'SalesLeadContacted':
      //TODO: update instance here
      break;
  }
  return salesLeads;
}