# Salesfarce

... is a fictitious, rudimentary and simplistic sales prospecting system. We are building it during a series of Domain Driven Design, CQRS and Eventsourcing exploration sessions at Vancouver's "DDD/CQRS/ES Practitioners' Meetup".

https://www.meetup.com/DDD-CQRS-ES/events/233590206/

https://www.meetup.com/DDD-CQRS-ES/events/233590334/

https://www.meetup.com/DDD-CQRS-ES/events/233590625/

Requires nodejs v4.0+

Requires [GoES](ttp://github.com/nicdex/goes) to store events.

## Getting Started

Install modules

`npm install`

Start app

`npm start`

## Events (as of 9/22/2016):

### Bounded Context: Sales prospecting

```
SalesLeadReceived:
    receivedAtDate: 09/22/2016
    salesLeadID: 1234
    email: joe@somemail.com
    firstname: Joe
    lastname: Miller
    company: Invalid Yaml, Inc.
    phone: 222-222-3333
    salesrep: barney@soldthings.com 

SalesLeadContacted:
    salesLeadID: 1234
    contactDate: 10/21/2016
    salesrep: barney@soldthings.com
    notes: 

SalesLeadResponded:
    salesLeadID: 1234
    respondedAtDate: 10/26/2016
    interested: yes
    notes:
```

### Bounded Context: Order fulfillment

```
ProductSold:
    customerId: 1234
    soldAtDate: 11/23/2016
    salesrep: barney@soldthings.com
    productId: 899
    quantity: 120
```