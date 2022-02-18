
const Modal = {
    Open() {
        document.querySelector('.modal-overlay').classList.add('active')
        document.querySelector('footer').classList.add('active')
    },
    Close() {
        document.querySelector('.modal-overlay').classList.remove('active')
        document.querySelector('footer').classList.remove('active')
    }
}


const storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances: transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances: transactions", JSON.stringify(transactions))
    }
}


const Transaction = {
    all: storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()

    },
    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }

        })
        return income
    },
    expenses() {
        let expenses = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expenses += transaction.amount
            }

        })
        return expenses

    },
    total() {
        let Total = Transaction.incomes() + Transaction.expenses()
        return Total
    }
}


//substituir os dados do HTML com os dados do JS
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {

        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index


        DOM.transactionsContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
                
                        <td class="description">${transaction.description}</td>
                        <td class="${CSSclass}">${amount}</td>
                        <td class="date">${transaction.date}</td>
                        <td>
                            <img onclick="Transaction.remove(${index})" src="./svgs/minus.svg" alt="Remover transação">
                        </td>
                
                `
        return html
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }


}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    },
    formatAmount(value) {

        value = Number(value) * 100


        return Math.round(value)
    },
    formatDate(date) {
        console.log(date)


        const splittedDate = date.split('-')

        return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`
    }

}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validatefield() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os camps")
        }
    },
    formatValues() {
        let { description, amount, date } = Form.getValues()

        date = Utils.formatDate(date)
        amount = Utils.formatAmount(amount)


        return {
            description,
            amount,
            date
        }

    },


    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""

    },
    submit(event) {
        event.preventDefault()


        try {
            //validação de dados
            Form.validatefield()
            //formatação
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            //salvar

            //apagar os dados do form
            Form.clearFields()
            //fechar o modal
            Modal.Close()
            //atualizar a aplicação
        } catch (error) {
            alert(error.message)
        }


    }
}


const App = {


    init() {

        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        DOM.updateBalance()
        storage.set(Transaction.all)

    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }

}

App.init()





