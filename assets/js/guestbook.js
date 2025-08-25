(function(){
  const form = document.getElementById('guestbook-form');
  const messageInput = document.getElementById('guestbook-message');
  const submitBtn = form.querySelector('.guestbook-submit');
  const status = document.getElementById('guestbook-status');

  if (!form) return;

  // Enable/disable button based on message content
  function updateButtonState() {
    const hasMessage = messageInput.value.trim().length > 0;
    submitBtn.disabled = !hasMessage;
  }

  // Listen for input changes
  messageInput.addEventListener('input', updateButtonState);
  messageInput.addEventListener('keyup', updateButtonState);

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    
    if (!message) {
      showStatus('Please enter a message.', 'error');
      return;
    }

    // Disable form during submission
    submitBtn.disabled = true;
    messageInput.disabled = true;
    showStatus('Submitting your message...', 'info');

    try {
      // Submit to Notion database
      const notionData = {
        name: 'Anonymous Visitor', // You can add a name field later if desired
        message: message.substring(0, 500),
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent.substring(0, 100)
      };

      // Always call the Netlify function using its absolute URL
      // This works even when the site itself is hosted on GitHub Pages
      const response = await fetch('https://websiteguestbook.netlify.app/.netlify/functions/notion-guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notionData)
      });

      if (response.ok) {
        showStatus('Thank you! Your message has been submitted successfully.', 'success');
        form.reset();
      } else {
        // Fallback to localStorage if Notion fails
        throw new Error('Notion submission failed');
      }
      
    } catch (error) {
      console.error('Notion submission failed, storing locally:', error);
      
      // Fallback: store in localStorage
      const guestbookEntry = {
        message: message.substring(0, 500),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString(),
        id: Date.now().toString()
      };
      
      const existingEntries = JSON.parse(localStorage.getItem('guestbookEntries') || '[]');
      existingEntries.push(guestbookEntry);
      localStorage.setItem('guestbookEntries', JSON.stringify(existingEntries));
      
      showStatus('Thank you! Your message has been received and stored.', 'success');
      form.reset();
    } finally {
      // Re-enable form
      messageInput.disabled = false;
      updateButtonState();
    }
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `guestbook-status guestbook-${type}`;
    if (type !== '') {
      setTimeout(() => {
        if (status.className === `guestbook-status guestbook-${type}`) {
          status.textContent = '';
          status.className = 'guestbook-status';
        }
      }, 5000);
    }
  }

  // Initialize button state
  updateButtonState();

  // Expose function to retrieve guestbook entries (for admin use)
  window.getGuestbookEntries = function() {
    const entries = JSON.parse(localStorage.getItem('guestbookEntries') || '[]');
    console.log('Guestbook entries:', entries);
    return entries;
  };

  // Function to clear guestbook entries (for admin use)
  window.clearGuestbookEntries = function() {
    localStorage.removeItem('guestbookEntries');
    console.log('Guestbook entries cleared');
  };
})();
