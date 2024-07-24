class TicketsDto {

    constructor(ticket) {
        this.ticket = ticket;
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
    }
}

export default TicketsDto;