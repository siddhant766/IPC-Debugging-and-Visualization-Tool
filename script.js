// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Apply the saved theme
  if (savedTheme === 'dark') {
    body.classList.replace('light-theme', 'dark-theme');
    themeToggle.textContent = '☀️';
  }
  
  // Theme toggle click handler
  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
  });
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-btn');
    const messageInput = document.getElementById('message-input');
    const ipcMethodSelect = document.getElementById('ipc-method');
    const delayInput = document.getElementById('delay-input');
    const clearMethodSelect = document.getElementById('clear-method');
    
    // IPC display elements
    const pipesDisplay = document.getElementById('pipes-display');
    const queuesDisplay = document.getElementById('queues-display');
    const memoryDisplay = document.getElementById('memory-display');
    
    // Poll for updates
    setInterval(updateDisplay, 1000);
    
    // Initial update
    updateDisplay();
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    clearBtn.addEventListener('click', clearData);
    
    function sendMessage() {
      const method = ipcMethodSelect.value;
      const message = messageInput.value;
      const delay = parseInt(delayInput.value) || 100;
      
      if (!message) {
        alert('Please enter a message');
        return;
      }
      
      fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method, message, delay }),
      })
      .then(response => response.json())
      .then(data => {
        messageInput.value = '';
        updateDisplay();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    
    function clearData() {
      const method = clearMethodSelect.value;
      
      fetch('/api/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method }),
      })
      .then(response => response.json())
      .then(data => {
        updateDisplay();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    
    function updateDisplay() {
      fetch('/api/ipc-status')
        .then(response => response.json())
        .then(data => {
          updateMethodDisplay('pipes', data.pipes, pipesDisplay);
          updateMethodDisplay('messageQueues', data.messageQueues, queuesDisplay);
          updateMemoryDisplay(data.sharedMemory, memoryDisplay);
        })
        .catch(error => {
          console.error('Error fetching IPC status:', error);
        });
    }
    
    function updateMethodDisplay(method, data, displayElement) {
      // Update status
      const statusElement = displayElement.querySelector('.status');
      statusElement.setAttribute('data-status', data.status);
      statusElement.querySelector('span').textContent = data.status;
      
      // Update messages
      const messageList = displayElement.querySelector('.message-list');
      updateList(messageList, data.messages, 'message-item');
      
      // Update issues
      const issueList = displayElement.querySelector('.issue-list');
      updateList(issueList, data.issues, 'issue-item');
    }
    
    function updateMemoryDisplay(data, displayElement) {
      // Update status
      const statusElement = displayElement.querySelector('.status');
      statusElement.setAttribute('data-status', data.status);
      statusElement.querySelector('span').textContent = data.status;
      
      // Update memory contents
      const memoryContents = displayElement.querySelector('.memory-contents');
      const items = Object.entries(data.data).map(([key, value]) => 
        `${key}: ${JSON.stringify(value)}`
      );
      updateList(memoryContents, items, 'memory-item');
      
      // Update issues
      const issueList = displayElement.querySelector('.issue-list');
      updateList(issueList, data.issues, 'issue-item');
    }
    
    function updateList(container, items, itemClass) {
      // Check current items to see what's new
      const currentItems = Array.from(container.children).map(el => el.textContent);
      
      // Clear container
      container.innerHTML = '';
      
      // Add items back with animation for new ones
      items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = itemClass;
        itemElement.textContent = item;
        
        // Add animation if this is a new item
        if (!currentItems.includes(item)) {
          itemElement.classList.add('new-item');
        }
        
        container.appendChild(itemElement);
      });
    }
  });
