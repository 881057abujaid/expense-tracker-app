// Array to store transactions and details
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Dashboard Data
let balance = document.getElementById('balance');
let totalExpense = document.getElementById('total-expense');
let totalIncome = document.getElementById('total-income');
let totalEnteries = document.getElementById('total-enteries');

// Form Data
const form = document.getElementById('transaction-form');
const category = document.getElementById('category');
const amount = document.getElementById('amount');
const date = document.getElementById('date');
const remark = document.getElementById('remark');

// Transaction List
let list = document.getElementById('transaction-list');

form.addEventListener("submit", e => {
    e.preventDefault();
    
    const type = document.querySelector('input[type="radio"]:checked').value;
    const balanceAmount = parseInt(balance.textContent);
    const transaction = {
        id: Date.now(),
        category: category.value,
        amount: Number(amount.value),
        date: date.value,
        remark: remark.value,
        type: type
    }

    if(transaction.category === "null" || transaction.amount === "" ||
        transaction.date === "" || transaction.remark === ""){
        alert('Please Fill all the fields');
        return;
    }

    if(transaction.type === "expense" && balanceAmount < transaction.amount){
        insufficientPopUp();
        return;
    }

    transactions.push(transaction);
    addTransaction(transaction);
    form.reset()
});

// Insufficient Balance Pop Up Message Function
function insufficientPopUp(){
    const popUp = document.getElementById('pop-up');
    const container = document.querySelector('.container');
    popUp.style.display = "flex";
    container.style.filter = "blur(5px)";
}

// Remove Pop Up Message Function
const removePopUp = document.getElementById('removePopUp');
removePopUp.addEventListener('click', () =>{
    const popUp = document.getElementById('pop-up');
    const container = document.querySelector('.container');
    popUp.style.display = "none";
    container.style.filter = "blur(0px)";
});

// Add Transaction Function
function addTransaction(transaction){
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
}

// Render Transactions Function
function renderTransactions(data = transactions){
    if(data.length === 0){
        list.innerHTML = "No Transaction Available";
        return;
    }
    list.innerHTML = `<table id="transaction-table">
                            <tr>
                                <th>Transaction</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                      </table>`;
    
    const transactionTable = document.getElementById('transaction-table');

    data.forEach(transaction =>{
            transactionTable.innerHTML += `<tr>
                                <td>
                                    <h2>${transaction.category}</h2>
                                    <p>${transaction.date}</p>
                                    <p>${transaction.remark}</p>
                                </td>
                                <td>
                                    <h2 style="color: ${transaction.type === 'expense' ? 'red' : 'green' };">₹${transaction.amount}</h2>
                                </td>
                                <td>
                                    <button class="edit-button" onclick="editTransaction(${transaction.id})">Edit</button>
                                    <button class="delete-button" onclick="deleteTransaction(${transaction.id})">Delete</button>
                                </td>
                            </tr>`
    });
    calculateTotal();
}

// Calculate Total to Dynamically update Dashboard Values
function calculateTotal(){
    let totalExpenseAmount = 0;
    let totalIncomeAmount = 0;
    transactions.forEach(transaction =>{
        if(transaction.type === "expense"){
            totalExpenseAmount += transaction.amount;
        }
        else if(transaction.type === "income"){
            totalIncomeAmount += transaction.amount;
        }
    })
    balance.textContent = parseFloat(totalIncomeAmount - totalExpenseAmount);
    totalExpense.textContent = parseFloat(totalExpenseAmount);
    totalIncome.textContent = parseFloat(totalIncomeAmount);
    totalEnteries.textContent = transactions.length;
}

// Delete Transaction Button Functionality
function deleteTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);
    addTransaction();
    calculateTotal();
}

// Edit Transaction Button Functionality
function editTransaction(id){
    const editForm = document.querySelector('.edit-form');
    const container = document.querySelector('.container');
    editForm.style.display = "block";
    container.style.filter = "blur(5px)";
    container.style.pointerEvents = "none";

    // Existing Form Data logic
    const editedCategory = document.getElementById('edited-category');
    const editedAmount = document.getElementById('edited-amount');
    const editedDate = document.getElementById('edited-date');
    const editedRemark = document.getElementById('edited-remark');

    let transaction = transactions.find(t => t.id === id);

    editedCategory.value = transaction.category;
    editedAmount.value = transaction.amount;
    editedDate.value = transaction.date;
    editedRemark.value = transaction.remark;

    // Edit Form Logic
    editForm.addEventListener('submit', e =>{
    e.preventDefault();

    if(editedCategory.value === "null" || editedAmount.value === 0 ||
        editedDate.value === "" || editedRemark.value === ""){
        alert("Please fill all the fields");
    }

    const editedTransaction = {
        id: id,
        category: editedCategory.value,
        amount: editedAmount.value,
        date: editedDate.value,
        remark: editedRemark.value,
        type: transaction.type
    }
    updateTransaction(editedTransaction);
    editForm.style.display = "none";
    container.style.filter = "blur(0)";
    container.style.pointerEvents = "all";
})
}

// Update Transaction Logic
function updateTransaction(transaction){
    transactions = transactions.map(t =>{
        if(t.id === transaction.id){
            return {
                ...t,
                category: transaction.category,
                amount: Number(transaction.amount),
                date: transaction.date,
                remark: transaction.remark,
                type: transaction.type
            }
        }
        return t;
    });
    renderTransactions();
    calculateTotal();
}

// Filter Buttons Logic Implementation
const filterButtons = document.querySelectorAll('.filter button');
let filteredTransactions = [...transactions];
filterButtons.forEach(button =>{
    button.addEventListener('click', () =>{
        setActiveButton(button);

        const filterType = button.textContent.toLowerCase();

        if(filterType === "all"){
            filteredTransactions = [...transactions];
        }
        else {
            filteredTransactions = transactions.filter(t => t.type === filterType);
        }
        renderTransactions(filteredTransactions);
    })
});

// Active Filter Button UI Handle
function setActiveButton(activeBtn){
    filterButtons.forEach(btn =>{
        btn.classList.remove('active');
    })
    activeBtn.classList.add('active');
}
renderTransactions();