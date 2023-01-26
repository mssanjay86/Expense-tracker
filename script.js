console.log(document.getElementById("amount").value);
function getIncomeOrExpense() {
  var dropDown = document.getElementById("dropDown");

  embed();
}
function embed() {
  if (dropDown.value === "Expense"  ) {
        document.getElementById("amount-label").innerHTML = dropDown.value;
    document.getElementById("text").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("add-transaction").innerHTML = "Add expense";
    document.getElementById("body").style.backgroundColor = "#dbd9fa";

  }
  if (dropDown.value === "Income") {

    document.getElementById("amount-label").innerHTML = dropDown.value;
    document.getElementById("text").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("add-transaction").innerHTML = "Add income";
    document.getElementById("body").style.backgroundColor = "#fcfcd4";

  }
}
function transactionPurpose() {
  if (document.getElementById("text").value == "") {
    document.getElementById("transactionPurposeErrorMsg").innerHTML = "This field cannot be empty.";
    return false;
  } else {
    document.getElementById("transactionPurposeErrorMsg").innerHTML = "";
    return true;
  }
}

function transactionAmount() {
  if (document.getElementById("amount").value == "") {
    document.getElementById("transactionAmountErrorMsg").innerHTML = "Please enter the amount.";
    if (document.getElementById("amount-label").innerHTML == "Expense") {
      if (document.getElementById("amount").value) {
      }
    }
    return false;
  } else {
    document.getElementById("transactionAmountErrorMsg").innerHTML = "";

    return true;
  }
}

function validateAll() {
  let isError = false;
  let errorCount = 0;
  if (!transactionPurpose()) {
    errorCount++;
  }
  if (!transactionAmount()) {
    errorCount++;
  }
  if (errorCount > 0) {
    isError = true;
  }
  return isError;
}

var balance;
var sum;
var expense;
var flag;
if (localStorage.getItem("balance") == null || undefined) {
  balance = 0;
} else {
  flag = "balance";
  balance = localStorage.getItem("balance");
  balance = convertToNumber(flag, balance);
}
if (localStorage.getItem("income") == null || undefined) {
  sum = 0;
} else {
  flag = "income";
  sum = localStorage.getItem("income");
  sum = convertToNumber(flag, sum);
}
if (localStorage.getItem("expense") == null || undefined) {
  expense = 0;
} else {
  flag = "expense";
  expense = localStorage.getItem("expense");
  expense = convertToNumber(flag, expense);
}

function convertToNumber(flag, ConvertAmount) {
  if (flag == "balance") {
    ConvertAmount = balance;
    ConvertAmount = ConvertAmount.replace(/\D/g, "");
    ConvertAmount = parseFloat(ConvertAmount);
  }
  if (flag == "income") {
    ConvertAmount = sum;
    ConvertAmount = ConvertAmount.replace(/\D/g, "");
    ConvertAmount = parseFloat(ConvertAmount);
  }
  if (flag == "expense") {
    ConvertAmount = expense;
    ConvertAmount = ConvertAmount.replace(/\D/g, "");
    ConvertAmount = parseFloat(ConvertAmount);
  }
  return ConvertAmount;
}
console.log(balance);
function onSubmit() {
  if (!validateAll()) {
    if (document.getElementById("amount-label").innerHTML == "Income") {
      let income = getIncome();
      let incomeDetails = {
        purpose: document.getElementById("text").value,
        income: income,
      };
      localStorage.setItem("transaction", JSON.stringify(incomeDetails));
    } else if (document.getElementById("amount-label").innerHTML == "Expense") {
      let expense = getExpense();
      let expenseDetails = {
        purpose: document.getElementById("text").value,
        expense: expense,
      };
      localStorage.setItem("transaction", JSON.stringify(expenseDetails));
    }

    alert("Your expense/income added successfully.");

    embedAmounts();
  } else {
    alert("Please fill all the fields.");
  }
}

function getIncome() {
  sum = sum + parseFloat(document.getElementById("amount").value);
  balance = balance + parseFloat(document.getElementById("amount").value);
  return sum;
}
function getExpense() {
  expense = expense + parseFloat(document.getElementById("amount").value);
  balance = balance - parseFloat(document.getElementById("amount").value);
  return expense;
}

function embedAmounts() {
  let newObject = localStorage.getItem("transaction");
  let parsedData = JSON.parse(newObject);
  let parsedIncome = parseFloat(parsedData.income);
  let parsedExpense = parseFloat(parsedData.expense);
  let parsedBalance = parseFloat(balance);
  let purpose = parsedData.purpose;

  let incomeText = parsedIncome.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
  let expenseText = parsedExpense.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
  let balanceText = parsedBalance.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 });

  if (parsedData.income > 0) {
    localStorage.setItem("income", "+" + incomeText);
    let localIncome = localStorage.getItem("income");
    document.getElementById("money-plus").innerHTML = localIncome;
    localStorage.setItem("balance", balanceText);
    let localBalance = localStorage.getItem("balance");

    document.getElementById("balance").innerHTML = localBalance;
    let incomeFlag = "income";
    storeHistory(purpose, incomeText, incomeFlag);
    embedInHistory(purpose, "+" + "&#8377;" + document.getElementById("amount").value);
  } else if (parsedData.expense > 0) {
    localStorage.setItem("expense", "-" + expenseText);
    let localExpense = localStorage.getItem("expense");

    document.getElementById("money-minus").innerHTML = localExpense;

    localStorage.setItem("balance", balanceText);
    let localBalance = localStorage.getItem("balance");

    document.getElementById("balance").innerHTML = localBalance;
    let expenseFlag = "expense";
    storeHistory(purpose, expenseText, expenseFlag);
    embedInHistory(purpose, "-" + "&#8377;" + document.getElementById("amount").value);
  }
}

function storeHistory(purpose, amount, historyFlag) {
  var listOfTransactions = [];
  if (historyFlag == "income") {
    let incomeAmount = amount;
    listOfTransactions.push({ transactionPurpose: purpose, amount: incomeAmount });
    localStorage.setItem("transactionHistory", JSON.stringify(listOfTransactions));
  }
  if (historyFlag == "expense") {
    let expenseAmount = amount;
    listOfTransactions.push({ transactionPurpose: purpose, amount: expenseAmount });
    localStorage.setItem("transactionHistory", JSON.stringify(listOfTransactions));
  }
}

function embedInHistory(purpose, amount) {
  let newList = document.createElement("li");
  newList.className = "minus";
  newList.innerHTML = purpose;
  let newSpan = document.createElement("span");
  newSpan.innerHTML = amount;
  newList.appendChild(newSpan);
  document.getElementById("list").appendChild(newList);
  clearFields();
}

function loadHistory() {
  let list = Array.from(JSON.parse(localStorage.getItem("transactionHistory")));
  console.log(typeof list);
  console.log(list);
  Array.from(JSON.parse(localStorage.getItem("transactionHistory"))).forEach((transaction) => {
    let newList = document.createElement("li");
    newList.className = "minus";
    newList.innerHTML = transaction.transactionPurpose;
    let newSpan = document.createElement("span");
    newSpan.innerHTML = transaction.amount;
    newList.appendChild(newSpan);
    document.getElementById("list").appendChild(newList);
  });
}

function clearFields() {
  document.getElementById("text").value = "";
  document.getElementById("amount").value = "";
}
