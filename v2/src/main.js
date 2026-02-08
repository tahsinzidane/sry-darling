const state = {
  history: JSON.parse(localStorage.getItem('apologyHistory')) || [],
  currentApology: null
};

// Emoji arrays for random selection
const heartEmojis = ['💖', '💕', '💗', '💝', '💓', '💞', '💘', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍'];

// Style templates
const styleTemplates = {
  heartfelt: {
    prefix: 'From the depths of my heart, ',
    suffix: ' 💕',
    separator: '\n'
  },
  poetic: {
    prefix: 'Like roses that bloom in spring, ',
    suffix: ' 🌹',
    separator: '\n~ '
  },
  sincere: {
    prefix: 'With utmost sincerity, ',
    suffix: ' ✨',
    separator: '\n'
  },
  playful: {
    prefix: 'Oopsie! ',
    suffix: ' 🎈',
    separator: '\n'
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadHistory();
  createParticles();
});

// Event listeners
function initializeEventListeners() {
  const form = document.getElementById('apologyForm');
  const copyBtn = document.getElementById('copyButton');
  const downloadBtn = document.getElementById('downloadButton');
  const shareBtn = document.getElementById('shareButton');

  form.addEventListener('submit', handleFormSubmit);
  copyBtn.addEventListener('click', handleCopy);
  downloadBtn.addEventListener('click', handleDownload);
  shareBtn.addEventListener('click', handleShare);
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('nameInput').value.trim();
  const message = document.getElementById('messageInput').value.trim();
  const count = parseInt(document.getElementById('countInput').value) || 100;
  const style = document.getElementById('styleSelect').value;
  const addEmojis = document.getElementById('addEmojis').checked;
  const addTimestamp = document.getElementById('addTimestamp').checked;

  if (!name || !message) {
    showToast('Please fill in all fields! 💝', 'error');
    return;
  }

  if (count < 1 || count > 1000) {
    showToast('Please enter a count between 1 and 1000! 📊', 'error');
    return;
  }

  const apology = generateApology(name, message, count, style, addEmojis, addTimestamp);
  displayApology(apology);
  saveToHistory({ name, message, count, style, timestamp: new Date().toISOString() });

  // Scroll to output
  document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('Apology generated successfully! 💖');
}

// Generate apology text
function generateApology(name, message, count, style, addEmojis, addTimestamp) {
  const template = styleTemplates[style];
  let apologyText = '';

  if (addTimestamp) {
    const now = new Date();
    apologyText += `📅 ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}\n\n`;
  }
  apologyText += `Dear ${name},\n\n`;
  apologyText += `${template.prefix}${message}${template.suffix}\n\n`;

  // Generate repeated apologies
  for (let i = 1; i <= count; i++) {
    let line = message;

    // Add random emoji if requested
    if (addEmojis && i % 5 === 0) {
      const randomEmoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      line += ` ${randomEmoji}`;
    }

    apologyText += `${template.separator}${line}`;

    // Add extra line break every 10 lines for readability
    if (i % 10 === 0 && i !== count) {
      apologyText += '\n';
    }
  }

  // Add closing
  apologyText += `\n\n💕 Forever yours,\n${addTimestamp ? 'Sent with love ❤️' : 'With all my love ❤️'}`;
  return apologyText;
}

// Display apology
function displayApology(apology) {
  state.currentApology = apology;

  const outputSection = document.getElementById('outputSection');
  const outputContent = document.getElementById('output');

  outputContent.textContent = apology;
  outputSection.style.display = 'block';

  updateStats(apology);
}

// Update statistics
function updateStats(text) {
  const chars = text.length;
  const words = text.trim().split(/\s+/).length;
  const loveLevel = chars > 5000 ? '💖💖💖💖💖' :
    chars > 3000 ? '💖💖💖💖' :
      chars > 1000 ? '💖💖💖' :
        chars > 500 ? '💖💖' : '💖';

  document.getElementById('charCount').textContent = chars.toLocaleString();
  document.getElementById('wordCount').textContent = words.toLocaleString();
  document.getElementById('loveLevel').textContent = loveLevel;
}

// Copy to clipboard
async function handleCopy() {
  if (!state.currentApology) return;

  try {
    await navigator.clipboard.writeText(state.currentApology);
    showToast('Copied to clipboard! 📋');
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = state.currentApology;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Copied to clipboard! 📋');
  }
}

// Download as text file
function handleDownload() {
  if (!state.currentApology) return;

  const blob = new Blob([state.currentApology], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);

  a.href = url;
  a.download = `apology-${timestamp}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Downloaded successfully! 💾');
}

// Share functionality
async function handleShare() {
  if (!state.currentApology) return;

  // Check if Web Share API is available
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Heartfelt Apology',
        text: state.currentApology
      });
      showToast('Shared successfully! 📤');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        fallbackShare();
      }
    }
  } else {
    fallbackShare();
  }
}

// Fallback share (copy to clipboard)
function fallbackShare() {
  handleCopy();
  showToast('Text copied! Share it anywhere you like 📤');
}

// Save to history
function saveToHistory(data) {
  state.history.unshift({
    ...data,
    id: Date.now()
  });

  // Keep only last 10 items
  if (state.history.length > 10) {
    state.history = state.history.slice(0, 10);
  }

  localStorage.setItem('apologyHistory', JSON.stringify(state.history));
  loadHistory();
}

// Load and display history
function loadHistory() {
  const historySection = document.getElementById('historySection');
  const historyList = document.getElementById('historyList');

  if (state.history.length === 0) {
    historySection.style.display = 'none';
    return;
  }

  historySection.style.display = 'block';
  historyList.innerHTML = '';

  state.history.forEach(item => {
    const historyItem = createHistoryItem(item);
    historyList.appendChild(historyItem);
  });
}



// Create history item element
function createHistoryItem(item) {
  const div = document.createElement('div');
  div.className = 'history-item';

  const date = new Date(item.timestamp);
  const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  div.innerHTML = `
    <div class="history-item-header">
      <span class="history-item-name">To: ${item.name}</span>
      <span class="history-item-date">${dateStr}</span>
    </div>
    <div class="history-item-preview">${item.message} (${item.count}x)</div>
  `;

  // Repopulate form with history item
  div.addEventListener('click', () => {
    document.getElementById('nameInput').value = item.name;
    document.getElementById('messageInput').value = item.message;
    document.getElementById('countInput').value = item.count;
    document.getElementById('styleSelect').value = item.style;

    document.getElementById('apologyForm').scrollIntoView({ behavior: 'smooth' });
    showToast('Form filled with history! ✨');
  });

  // Remove the item from state.history
  div.addEventListener('dblclick', () => {
    state.history = state.history.filter(h => h.timestamp !== item.timestamp);
    localStorage.setItem('apologyHistory', JSON.stringify(state.history));
    div.remove();
    showToast('History item deleted 🗑️');
  });



  return div;
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Create animated particles
function createParticles() {
  const container = document.getElementById('particles');
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    particle.style.background = `rgba(255, ${Math.random() * 107 + 100}, 157, ${Math.random() * 0.3 + 0.1})`;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animation = `float ${Math.random() * 10 + 15}s infinite ease-in-out`;
    particle.style.animationDelay = Math.random() * 5 + 's';

    container.appendChild(particle);
  }
}

// Add keyboard shortcuts
// Ctrl/Cmd + Enter to submit form
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('apologyForm').dispatchEvent(new Event('submit'));
  }

  // Ctrl/Cmd + C to copy (when output is visible)
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && state.currentApology) {
    const selection = window.getSelection().toString();
    if (!selection) {
      e.preventDefault();
      handleCopy();
    }
  }
});

// Auto-save form data
const formInputs = ['nameInput', 'messageInput', 'countInput', 'styleSelect'];
formInputs.forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    // Load saved value
    const savedValue = localStorage.getItem(`form_${id}`);
    if (savedValue && id !== 'countInput') {
      element.value = savedValue;
    }

    // Save on change
    element.addEventListener('change', () => {
      localStorage.setItem(`form_${id}`, element.value);
    });
  }
});

console.log('❤️ Heartfelt Apologies Generator loaded successfully!');