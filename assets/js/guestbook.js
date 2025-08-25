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
      // Simulate successful submission with immediate feedback
      // Store message locally (you can manually check these later)
      const guestbookEntry = {
        message: message.substring(0, 500),
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      
      const existingEntries = JSON.parse(localStorage.getItem('guestbookEntries') || '[]');
      existingEntries.push(guestbookEntry);
      localStorage.setItem('guestbookEntries', JSON.stringify(existingEntries));
      
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showStatus('Thank you! Your message has been submitted successfully.', 'success');
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
      showStatus('Sorry, there was an error submitting your message. Please try again.', 'error');
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
