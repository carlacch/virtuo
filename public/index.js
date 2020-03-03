'use strict';

//list of cars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const cars = [{
  'id': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'name': 'fiat-500-x',
  'pricePerDay': 36,
  'pricePerKm': 0.10
}, {
  'id': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'name': 'mercedes-class-a',
  'pricePerDay': 44,
  'pricePerKm': 0.30
}, {
  'id': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'name': 'bmw-x1',
  'pricePerDay': 52,
  'pricePerKm': 0.45
}];

//list of current rentals
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful for step 4
const rentals = [{
  'id': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'driver': {
    'firstName': 'Roman',
    'lastName': 'Frayssinet'
  },
  'carId': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'pickupDate': '2020-01-02',
  'returnDate': '2020-01-02',
  'distance': 100,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'driver': {
    'firstName': 'Redouane',
    'lastName': 'Bougheraba'
  },
  'carId': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'pickupDate': '2020-01-05',
  'returnDate': '2020-01-09',
  'distance': 300,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'driver': {
    'firstName': 'Fadily',
    'lastName': 'Camara'
  },
  'carId': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'pickupDate': '2019-12-01',
  'returnDate': '2019-12-15',
  'distance': 1000,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'rentalId': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}];

console.log(cars);
console.log(rentals);
console.log(actors);

function rental_price(cars, rentals){
  let price = 0;
  let price_time = 0;
  let price_dist = 0;
  let commission = 0

  //STEP 1
  rentals.forEach(element => {
    let day = (new Date(element.returnDate) - new Date(element.pickupDate))/(24*60*60*1000) + 1 ;
    let IDcar = element.carId;
    for (let index = 0; index < cars.length; index++) {
      const car = cars[index];
      if (car.id == IDcar) {
        price_time = day*car.pricePerDay;
        price_dist = (element.distance)*car.pricePerKm;
        price = price_time+price_dist;
        
        //STEP 2
        if (day > 1 && day <= 4) {price*= (1-0.1); }
        if( day > 4 && day <= 10) {price*= (1-0.3); }
        if( day > 10) {price*= 0.5; }

        break;
      }
    }
    element.price = price;

    //STEP 3
    commission = element.price*(0.3);
    element.commission.insurance = commission*(0.5);
    element.commission.treasury = day;
    element.commission.virtuo = commission - element.commission.treasury - element.commission.insurance;

    //STEP 4
    if (element.options.deductibleReduction) {
      let additional_charge = day*4;
      element.price+= additional_charge;
      element.commission.virtuo += additional_charge;
    }
  });
}

rental_price(cars,rentals);
console.log(rentals);

function pay_actors(rentals, actors){
  actors.forEach(actor => {
    for (let i = 0; i < rentals.length; i++) {
      const element = rentals[i];
      if(actor.rentalId == element.id){
        let payments = actor.payment;
        payments.forEach(pay => {
          if (pay.who == 'driver')
          {
            pay.amount = element.price;
          }
          if (pay.who == 'partner')
          {
            pay.amount = element.price - element.commission.virtuo - element.commission.insurance - element.commission.treasury;
          }
          if (pay.who == 'insurance')
          {
            pay.amount = element.commission.insurance;
          }
          if (pay.who == 'treasury')
          {
            pay.amount = element.commission.treasury;
          } 
          if (pay.who == 'virtuo')
          {
            pay.amount = element.commission.virtuo;
          }          
        });
        console.log(payments);
        break;
      }      
    }    
  });
}

pay_actors(rentals,actors);