'use strict';

// Data
const account1 = {
    owner: 'Himanshu Jangid',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,

};
const account2 = {
    owner: 'Rohit Mehra',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};
const account6 = {
    owner: 'Rajesh Kumar',
    movements: [50, 125, 1000, 500000, 122222, 800000, 82, -50000],
    interestRate: 1.75,
    pin: 6666,
};
const account5 = {
    owner: 'Amit Kumar',
    movements: [50, 125, 1000, 500000, 122222, 800000, 82, -50000],
    interestRate: 1.75,
    pin: 5555,
}


const accounts = [account1, account2, account3, account4, account5, account6];


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
    containerMovements.innerHTML = ' '
    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    let call;
    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal'

        const html = `<div class="movements__row">
    <div class="movements__type       movements__type--${type}">${i + 1} - ${type}</div>

    <div class="movements__value">${mov}</div>`
        containerMovements.insertAdjacentHTML('beforeend', html)

    })

}


const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0)
    labelBalance.textContent = `${acc.balance} ₹`
    const date = new Date();
    labelDate.textContent = date
}

const calcDisplaySummary = function (acc) {
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
    labelSumIn.textContent = `${incomes}₹`


    const outcomes = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(outcomes)}₹`

    const interests = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).filter((int, i, arr) => int > 1).reduce((acc, mov) => acc + mov, 0)
    labelSumInterest.textContent = `${interests}₹`
}



const createUserNames = function (accs) {
    accs.forEach(function (acc) {
        acc.userName = acc.owner.toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    })
}
createUserNames(accounts)
const updateUi = function (acc) {
    //display movements
    displayMovements(acc.movements)
    //display balance
    calcDisplayBalance(acc)
    // display summary
    calcDisplaySummary(acc)

}

let curruntAccount;
// event handler
btnLogin.addEventListener('click', function (e) {
    // preventing form from submitting
    e.preventDefault();

    curruntAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
    console.log(curruntAccount)

    if (curruntAccount?.pin === Number(inputLoginPin.value)) {
        // display ui and message
        labelWelcome.textContent = `Welcome Back ${curruntAccount.owner.split(' ')[0]}`
        containerApp.style.opacity = 100;
        // clear input fields
        inputLoginUsername.value = inputLoginPin.value = ''
        inputLoginPin.blur();
        updateUi(curruntAccount);

    }
    else {
        alert('User Not Found');
        inputLoginUsername.value = inputLoginPin.value = ''
    }
    [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
        //         // 0, 2, 4, 6
        if (i % 2 === 0) row.style.backgroundColor = '#038095';
        if (i % 2 != 0) row.style.backgroundColor = '#a9a300';
    });
})

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(curruntAccount);
    const amount = Number(inputTransferAmount.value);
    const recieverAcc = accounts.find(acc => acc.userName === inputTransferTo.value)
    inputTransferTo.value = inputTransferAmount.value = ''
    if (amount > 0 && recieverAcc && curruntAccount.balance >= amount && recieverAcc?.userName !== curruntAccount) {
        curruntAccount.movements.push(-amount)
        recieverAcc.movements.push(amount);
        updateUi(curruntAccount);
    }
})

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value)
    if (amount > 0 && curruntAccount.movements.some(mov => mov >= amount * 0.1)) {
        // add the movement 
        curruntAccount.movements.push(amount);
        updateUi(curruntAccount);
        inputLoanAmount.value = ''
    }
    else {
        alert('you are Not eligible for this loan amount')
        inputLoanAmount.value = ''
    }
})

btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    if (Number(inputClosePin.value) === curruntAccount.pin && inputCloseUsername.value === curruntAccount.userName) {
        const index = accounts.findIndex(acc => acc.userName === curruntAccount.userName)
        // deleting account
        accounts.splice(index, 1)

        // hiding ui
        containerApp.style.opacity = 0;
    }
    else {
        alert('wrong detailes');

    }
    inputClosePin.value = inputCloseUsername.value = ''
    labelWelcome.textContent = `Log in to get started`
})

let sortedstate = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(curruntAccount.movements, !sortedstate)
    sortedstate = !sortedstate;
})
