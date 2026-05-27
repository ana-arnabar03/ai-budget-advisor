// Get references to the HTML elements
const incomeInput = document.getElementById('income');
const expensesDiv = document.getElementById('expenses');
const addExpenseBtn = document.getElementById('add-expense');
const analyzeBtn = document.getElementById('analyze');
const resultDiv = document.getElementById('result');

// Add a new expense row when the button is clicked
addExpenseBtn.addEventListener('click', function() {
  const row = document.createElement('div');
  row.classList.add('expense-row');
  row.innerHTML = `
    <input type="text" placeholder="Category (e.g. Food)" class="expense-name" />
    <input type="number" placeholder="Amount ($)" class="expense-amount" />
  `;
  expensesDiv.appendChild(row);
});

// Analyze the budget when the button is clicked
analyzeBtn.addEventListener('click', async function() {
  const income = incomeInput.value;

  // Collect all expense rows
  const expenseNames = document.querySelectorAll('.expense-name');
  const expenseAmounts = document.querySelectorAll('.expense-amount');

  let expenseList = '';
  for (let i = 0; i < expenseNames.length; i++) {
    const name = expenseNames[i].value;
    const amount = expenseAmounts[i].value;
    if (name && amount) {
      expenseList += `${name}: $${amount}\n`;
    }
  }

  // Build the message to send to the AI
  const userMessage = `
    My monthly income is $${income}.
    Here are my expenses:
    ${expenseList}
    Please analyze my budget and give me helpful, friendly advice.
  `;

  // Show a loading message while waiting
  resultDiv.style.display = 'block';
  resultDiv.textContent = 'Analyzing your budget...';

  // Call the Claude API
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },  
      
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const aiReply = data.content[0].text;
    resultDiv.textContent = aiReply;

  } catch (error) {
    resultDiv.textContent = 'Something went wrong. Please try again!';
  }
});
