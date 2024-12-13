const form = document.querySelector(".add");
const filters = document.querySelector(".filters");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const applyFiltersButton = document.getElementById("applyFilters");
const clearFiltersButton = document.getElementById("clearFilters");

let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];

function updateStatistics() {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);

  const updatedExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);

  const updatedBalance = updatedIncome - updatedExpense;
  balance.textContent = updatedBalance.toFixed(2);
  income.textContent = updatedIncome.toFixed(2);
  expense.textContent = updatedExpense.toFixed(2);
}

function generateTemplate(id, source, amount, category, time) {
  return `<li data-id="${id}">
              <p>
                <span>${source}</span>
                <span id="time">${time}</span>
              </p>
              <span>Category: ${category}</span>
              $<span>${Math.abs(amount)}</span>
              <i class="bi bi-trash delete"></i>
          </li>`;
}

function addTransactionDOM(id, source, amount, category, time) {
  if (amount > 0) {
    incomeList.innerHTML += generateTemplate(id, source, amount, category, time);
  } else {
    expenseList.innerHTML += generateTemplate(id, source, amount, category, time);
  }
}

function addTransaction(source, amount, category) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source: source,
    amount: amount,
    category: category,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDOM(transaction.id, source, amount, category, transaction.time);
}

function getTransaction() {
  transactions.forEach((transaction) => {
    addTransactionDOM(transaction.id, transaction.source, transaction.amount, transaction.category, transaction.time);
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function filterTransactions() {
  const filterDate = filters.filterDate.value;
  const filterCategory = filters.filterCategory.value;
  const filteredTransactions = transactions.filter((transaction) => {
    const matchDate = filterDate ? transaction.time.includes(filterDate) : true;
    const matchCategory = filterCategory ? transaction.category === filterCategory : true;
    return matchDate && matchCategory;
  });

  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  filteredTransactions.forEach((transaction) => {
    addTransactionDOM(transaction.id, transaction.source, transaction.amount, transaction.category, transaction.time);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.source.value.trim() === "" || form.amount.value === "" || form.category.value === "") {
    return alert("Please add proper values!");
  }
  addTransaction(form.source.value.trim(), Number(form.amount.value), form.category.value);
  updateStatistics();
  form.reset();
});

applyFiltersButton.addEventListener("click", filterTransactions);

clearFiltersButton.addEventListener("click", () => {
  filters.filterDate.value = "";
  filters.filterCategory.value = "";
  getTransaction();
});

incomeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
    
  }
});

function init() {
  updateStatistics();
  getTransaction();
}

init();
