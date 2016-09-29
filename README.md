# Salesfarce

... is a fictitious, rudimentary and simplistic sales prospecting system. We are building it during a series of Domain Driven Design, CQRS and Eventsourcing exploration sessions at Vancouver's "DDD/CQRS/ES Practitioners' Meetup".

https://www.meetup.com/DDD-CQRS-ES/events/233590206/

https://www.meetup.com/DDD-CQRS-ES/events/233590334/

https://www.meetup.com/DDD-CQRS-ES/events/233590625/

## Getting Started

### Requirements

* [NodeJS](https://nodejs.org) v4.5+
* [GoES](http://github.com/nicdex/goes) to store events
  * install using `npm install goes-install` (Only supported for Windows and Linux for now)
  
### Requirements to compile native NodeJS modules (i.e. zmq).

#### Windows

* windows-build-tools npm package installed
  * `npm install --global windows-build-tools` (**IMPORTANT**: must be run as Administrator)
  
*This step can be skipped if you can already compile native nodejs modules on your computer.*

#### Linux

* build-essential distribution package installed 
  * `sudo apt-get install build-essential`

#### Mac OSX

*TODO*

### Install modules

`npm install`

### Start app

#### 1) Start GoES

Windows

`start .deps\goes\bin\goes.exe --db=c:\temp\salesfarce-events`

Linux

`.deps/goes/bin/goes --db=/tmp/salesfarce-events &`

#### 2) Start the API

`npm start`

HTTP API is running at `http://localhost:8080/`

*Note: Linux user must adjust the goesStoragePath in config/local.json to /tmp/salesfarce-events before starting the app*

### Run tests

`npm test`

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