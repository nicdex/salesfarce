export default class ContactInformationReceived {
  constructor(objGraph) {
    this.salesLeadId = objGraph.salesLeadId;
    this.salesRepId = objGraph.salesRepId;
    this.email = objGraph.email;
    this.firstName = objGraph.firstName;
    this.lastName = objGraph.lastName;
    this.company = objGraph.company;
    this.phone = objGraph.phone;
    this.receivedAtDate = objGraph.receivedAtDate;
  }
}