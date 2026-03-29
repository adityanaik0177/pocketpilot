// Core Application Logic for PocketPilot

const STORAGE_KEY = 'pocketpilot_data';

// Default Data Structure
const defaultData = {
  expenses: [],
  reminders: [],
  settings: {
    monthlyBudget: 5000, // default budget
    notificationTime: '09:00'
  }
};

// Initialize or Load Data
function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  } else {
    saveData(defaultData);
    return defaultData;
  }
}

// Save Data
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Global App State
window.appData = loadData();

// Utility: Generate Unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Add Expense Entry
function addEntry(type, amount, category, description, date = new Date().toISOString()) {
  const entry = {
    id: generateId(),
    type,
    amount: parseFloat(amount),
    category,
    description,
    date
  };
  window.appData.expenses.push(entry);
  saveData(window.appData);
  return entry;
}

// Add Reminder
function addReminder(type, name, amount) {
  const reminder = {
    id: generateId(),
    type, // 'give' or 'take'
    name,
    amount: parseFloat(amount)
  };
  window.appData.reminders.push(reminder);
  saveData(window.appData);
  return reminder;
}

// Get Data for Specific Month and Year
function getMonthlyData(targetMonth = new Date().getMonth(), targetYear = new Date().getFullYear()) {
  let credit = 0;
  let debit = 0;

  const monthlyExpenses = window.appData.expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
  });

  monthlyExpenses.forEach(e => {
    if (e.type === 'credit') credit += e.amount;
    else debit += e.amount;
  });

  return { credit, debit, balance: credit - debit, expenses: monthlyExpenses };
}

// Get Data for Today
function getDailyData(date = new Date()) {
  let credit = 0;
  let debit = 0;
  
  const todayExpenses = window.appData.expenses.filter(e => {
    const d = new Date(e.date);
    return d.toDateString() === date.toDateString();
  });

  todayExpenses.forEach(e => {
    if (e.type === 'credit') credit += e.amount;
    else debit += e.amount;
  });

  return { credit, debit, balance: credit - debit, expenses: todayExpenses };
}

// Update Budget & Notification Settings
function updateSettings(budget, time) {
  window.appData.settings.monthlyBudget = parseFloat(budget);
  window.appData.settings.notificationTime = time;
  saveData(window.appData);
}

// Setup Shared Sidebar for Dashboard
function renderSidebar(activePage) {
  const sidebarHTML = `
    <div class="sidebar">
      <div class="brand">PocketPilot</div>
      <ul class="nav-links">
        <li><a href="today.html" class="${activePage === 'today' ? 'active' : ''}">Today's Expense</a></li>
        <li><a href="weekly.html" class="${activePage === 'weekly' ? 'active' : ''}">Weekly Expense</a></li>
        <li><a href="monthly.html" class="${activePage === 'monthly' ? 'active' : ''}">Monthly Expense</a></li>
        <li><a href="yearly.html" class="${activePage === 'yearly' ? 'active' : ''}">Yearly Expense</a></li>
        <li><a href="features.html" class="${activePage === 'features' ? 'active' : ''}">Other Features</a></li>
        <li style="margin-top: auto;"><a href="index.html">Log Out</a></li>
      </ul>
    </div>
  `;
  document.getElementById('sidebar-container').innerHTML = sidebarHTML;
}
