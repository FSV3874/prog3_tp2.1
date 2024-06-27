class Customer {
    constructor(id, name, email){
        this.id = id;
        this.name = name;
        this.email = email;
    }
    get info(){
        return `${this.name} ${this.email}`;
    }
}

class Reservation {
    constructor(id, customer, date, guests){
        this.id = id;
        this.customer = customer;
        this.date = new Date (date);
        this.guests = guests;
    }
    get info(){
        return `Fecha: ${this.date.toLocaleString()}, 
        ${this.customer.info}, Numero de comensales: ${this.guests}`;
    }
    static validateReservation(date, guests){
        const reservationDate = new Date (date);
        const currentDate = new Date ();
        return reservationDate >= currentDate && guests >0;
    }
}


class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        // Ordenar las reservas por fecha
        this.reservations.sort((a, b) => a.date - b.date);

        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
}

document
    .getElementById("reservation-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate =
            document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        if (Reservation.validateReservation(reservationDate, guests)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );

            restaurant.addReservation(reservation);
            restaurant.render();

            localStorage.setItem("reservations", JSON.stringify(restaurant.reservations)); /*guarda en el disco*/
            document.getElementById("reservation-form").reset(); /*Limpia el formulario*/

        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });



const restaurant = new Restaurant("El Lojal Kolinar");

// Función para cargar las reservas guardadas del almacenamiento local
function loadReservations() {
    const savedReservations = localStorage.getItem("reservations");
    if (savedReservations) {
        const parsedReservations = JSON.parse(savedReservations);
        parsedReservations.forEach((reservation) => {
            const currentDateTime = new Date();
            const reservationDateTime = new Date(reservation.date);
            if (reservationDateTime >= currentDateTime) {
                const customer = new Customer(
                    reservation.customer.id,
                    reservation.customer.name,
                    reservation.customer.email
                );
                const newReservation = new Reservation(
                    reservation.id,
                    customer,
                    reservation.date,
                    reservation.guests
                );
                restaurant.addReservation(newReservation);
            }else {
                alert("Datos de reserva inválidos");
            }
        });
        restaurant.render();
    }
}
loadReservations();

/*const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
} else {
    alert("Datos de reserva inválidos");
}*/