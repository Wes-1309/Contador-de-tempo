const transactionsUl = document.querySelector('#transactions') // Constante indicado o local onde será criado o elemento <li>
const incomeDisplay = document.querySelector('#money-plus') // Constante indicado o local onde será incluso as entradas (positivo)
const expenseDisplay = document.querySelector('#money-minus') // Constante indicado o local onde será incluso as saídas (negativo)
const balanceDisplay = document.querySelector('#balance') // Constante indicado o local onde será incluso o saldo em carteira
const form = document.querySelector('#form') // Constante indicando o campo do formulário para acrescentar receidas e despesas.
const inputTransactionName = document.querySelector('#text') // Constante indicando o campo que vai receber o nome da transação (Depesa ou Receita)
const inputTransactionAmount = document.querySelector('#amount')

/*
let transactions = [
    {id:1, name: 'Bolo de Brigadeiro', amount: -20},
    {id:2, name: 'Salario', amount: 300},
    {id:3, name: 'Torta de Frango', amount: -10},
    {id:4, name: 'Violão', amount: 150}
] // criando um array (JSON), para buscar as informações.

Utilizado no começo da criação das funções, após criar o localStorage, não precisou mais e pode ser deletado.
*/

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID =>{ // Função criada para deletar um item na carteira e incluso no button.
    transactions = transactions.filter(transaction => 
        transaction.id !== ID)
    init()
}

const addTransactionIntoDOM = transaction =>{
    //Obter o operador matemático

    const operator = transaction.amount < 0 ? '-' : '+' // Para definir o sinal
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus' // para criar a class minus ou plus
    const amountWithoutOperator = Math.abs(transaction.amount) // para voltar um número absoluto, sem sinal
    const li = document.createElement('li') // criando um elemento <li>, porém cria como objeto.

    li.classList.add(CSSClass) // adicionando a class <li class="">
    li.innerHTML = `
    ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
        </button>
    ` //Inserindo o formato como será criado o elemento <li>
    
    transactionsUl.append(li) // Adiciona em forma de string-> Append insere por último e o prepend adiciona por primeiro.

}


const updateBalanceValues = () => { //receber os valores de cada transação, gerando um array.
    
    const transactionsAmount = transactions
        .map(transaction => transaction.amount)
    const total = transactionsAmount  //Função executa a soma dos valores descritos
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    const income = transactionsAmount  //Função para buscar somente valores desejado, neste caso somente o que é receita (positivo)
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
    const expense = Math.abs(transactionsAmount  //Função para buscar somente valores desejado, neste caso somente o que é gasto (negativo)
        .filter(value => value <0)
        .reduce((accumulator, value) => accumulator + value, 0)) // Incluso o Math.abs() para retirar o sinal de (-).
        .toFixed(2)

    balanceDisplay.textContent = `R$ ${total}` // Irá mostra no html o valor total da carteira
    incomeDisplay.textContent = `R$ ${income}` // Irá mostra no html o valor total das entradas (positivo)
    expenseDisplay.textContent = `R$ ${expense}` // Irá mostra no html o valor total das saídas (negativo)
}


const init = () => { //Carrega as informações quando a página for carregada.
    transactionsUl.innerHTML = '' //Para limpar a string e não duplicar os valores quando acrescentar uma nova transação
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

// Adicionando a lista de eventos no FORM

const updateLocalSorage = () => { // Criado função para armazenar no local storage as informações
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000) //Função para gerar um ID aleatório

form.addEventListener('submit', event => {
    event.preventDefault() // Para não usar o padrão default de envio do submit e sim usar a função criado abaixo.
    
    const transactionName = inputTransactionName.value.trim() // Para armazenar as informações inclusas no campo de descrição
    const transactionAmount = inputTransactionAmount.value.trim() // Para armazenar as informações inclusas no campo de valores
    
    if(transactionName === '' || transactionAmount === ''){ // Função que vai solicitar que ambos os campos sejam preenchidos para envio.
        alert('Por favor, preencha tanto o nome quanto o valor da transação!') 
        return // Para a função casa o IF acima não seja respeitado, assim não segue com a sequência da função.
    }

    const transaction = { //Para gerar as informações inclusas em forma de array para enviar ao transactions
        id:generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount) // Utilizado para transformar a transaction amount em número ao invés de string
    }

    transactions.push(transaction)
    init()
    updateLocalSorage()
    
    inputTransactionName.value = '' // Para limpar o campo após incluso as informações da decrição
    inputTransactionAmount.value = '' // Para limpar o campo após incluso as informações do valor

})