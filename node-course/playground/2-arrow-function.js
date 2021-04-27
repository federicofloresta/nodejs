// const square = (x) => x * x;

// console.log(square(5));

const event = {
    name: "Birthday Party",
    guestList: ["Federico", "Mike","Eedi"],
    printGuestList() {
        console.log("Guest list for " + this.name)
        this.guestList.forEach((guest) => {
            console.log(guest + " is attending " + this.name)
        })
            
    }
};

event.printGuestList();
//we use "this" keyword when dealing with objects that we want to target specific properties