'use strict';

// Simply Bank App

const account1 = {
  userName: 'Cecil Ireland',
  transactions: [500.12, 250.98, -300, 5000.68, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
};

const account2 = {
  userName: 'Amani Salt',
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
};

const account3 = {
  userName: 'Corey Martinez',
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
};

const account4 = {
  userName: 'Kamile Searle',
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
};

const account5 = {
  userName: 'Oliver Avila',
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

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
const inputCloseNickname = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Создаем функцию обновления интерфейса
const updateUI = function (currentAccount) {
  //Display trans
  displayTransactions(currentAccount.transactions);

  //Display balance
  displayBalance(currentAccount);

  //Display total
  displayTotal(currentAccount);
};

//Создаем функцию отображения транзакций и сразу же сортируем
const displayTransactions = function (transactions, sort = false) {
  containerTransactions.innerHTML = ''; //Очищаем поле. Textcontent возвращает текст, а данный метод возвращает еще и сам код.

  //Создаем переменную которая в зависимости от sort будет сортировать или не будет массив с транзакциями. Slice используется чтобы сделать копию входного массива, также можно было использовать оператор спред.
  let transacs = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;

  transacs.forEach(function (trans, index) {
    const transType = trans > 0 ? 'deposit' : 'withdrawal';

    //Создаем код для вставки в html документ
    const transactionRow = `
    <div class="transactions__row">
          <div class="transactions__type transactions__type--${transType}">
           ${index + 1} ${transType}
          </div>        
          <div class="transactions__value">${trans.toFixed(2)}</div>
        </div>
    `;

    //Вставляем код в html
    containerTransactions.insertAdjacentHTML('afterbegin', transactionRow); //after begin обозначает куда вставляем, transactionRow обозначает что вставляем
  });
};

//Создаем функцию которая будет создавать никнеймы, которые состоят из первых букв имени и фамилии и помещать ники в объект.
const creatNickNames = function (accs) {
  accs.forEach(acc => {
    acc.nickname = acc.userName
      .toLocaleLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
creatNickNames(accounts);

//Отображаем баланс в приложении после транзакций
const displayBalance = function (account) {
  const balance = account.transactions.reduce((acc, trans) => acc + trans, 0);
  account.balance = balance;
  labelBalance.textContent = `${balance.toFixed(2)}$`;
};

//Создаем функцию подсчета общей суммы всех выводов и пополнений
const displayTotal = function (account) {
  const depositTotal = account.transactions
    .filter(a => a > 0)
    .reduce((a, b) => a + b, 0);
  const withdrawalTotal = account.transactions
    .filter(a => a < 0)
    .reduce((a, b) => a + b, 0);
  const interest = account.transactions
    .filter(a => a > 0)
    .map(a =>
      (a * account.interest) / 100 >= 5 ? (a * account.interest) / 100 : 0
    )
    .reduce((a, b) => a + b, 0);

  labelSumIn.textContent = `${depositTotal.toFixed(2)}$`;
  labelSumOut.textContent = `${withdrawalTotal.toFixed(2)}$`;
  labelSumInterest.textContent = `${interest.toFixed(2)}$`;
};

//Создаем глобальную переменную в которой будет храниться информация о текущем пользователе
let currentAccount;

//Создаем функцию для входа в аккаунт под своим логином и паролем
btnLogin.addEventListener('click', function (a) {
  a.preventDefault(); //функция которая не дает автоматичесски перезагрузиться странице, так как слушатель сопряжен с кнопкой которая находится в form html

  //Проверяем существует ли введенный аккаунт
  currentAccount = accounts.find(
    account => account.nickname == inputLoginUsername.value
  );

  //Проверяем совпадает ли введенный пинкод
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Отображаем юзер интерфейс
    containerApp.style.opacity = 100;

    //Изменяем приветствие
    labelWelcome.textContent = `Рады, что Вы снова с нами, ${
      currentAccount.userName.split(' ')[0]
    }!`;

    //Обновляем интерфейс

    updateUI(currentAccount);

    //Очищаем введенные данные
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur(); //Убираем курсор из инпута
  }
});

//Создаем функцию перевода денег
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //Очень частая практика когда работает с инпутами, иначе при нажатии клавиши страница будет перезагружаться

  //Создаем перемменную с суммой перевода
  const transferAmount = +inputTransferAmount.value;

  //Переменная получателя в виде никнейма
  const recipientNickname = inputTransferTo.value;

  //Переменная объекта получателя
  const recipientAccount = accounts.find(
    account => account.nickname === recipientNickname
  );

  //Очищаем данные даже если по нажатию кнопки ничего не произойдет
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  //Проверяем достаточно ли на счету средств
  if (
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    recipientAccount?.nickname !== currentAccount.nickname &&
    recipientAccount
  ) {
    //Убираем средства с одного счета и добавляем на другой счет
    recipientAccount.transactions.push(transferAmount);
    currentAccount.transactions.push(-transferAmount);
    updateUI(currentAccount);
  }
});

//Создаем функцию удаления аккаунта
btnClose.addEventListener('click', function (a) {
  a.preventDefault();

  if (
    inputCloseNickname.value == currentAccount.nickname &&
    +inputClosePin.value == currentAccount.pin
  ) {
    //Удаляем аккаунт из всех счетов, но для начала найдем индекс этого аккаунта
    const currentAccountIndex = accounts.findIndex(
      account => account.nickname == currentAccount.nickname
    );
    //Удаляем аккаунт
    accounts.splice(currentAccountIndex, 1);

    //Очищаем поля ввода
    inputCloseNickname.value = '';
    inputCloseNickname.pin = '';

    //Закрываем интерфейс
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Войдите в свой аккаунт';
  }
});

//Создаем функцию запроса займа
btnLoan.addEventListener('click', function (a) {
  a.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  //Определяем есть ли хоть один депозит больше 10% запроса
  if (
    loanAmount > 0 &&
    currentAccount.transactions.some(a => a >= 0.1 * loanAmount)
  ) {
    currentAccount.transactions.push(loanAmount);
    updateUI(currentAccount);
  }
  //Очищаем инпут
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//Создаем переменную которая определяет отсоритрованы ли транзакции или нет
let transactionsSorted = false;

//Добавляем функцию сортировки транзакций
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  //Передаем противополжное значение transactionsSorted и сразу же меняем его в голбальном контексте
  displayTransactions(currentAccount.transactions, !transactionsSorted);
  transactionsSorted = !transactionsSorted;
});
