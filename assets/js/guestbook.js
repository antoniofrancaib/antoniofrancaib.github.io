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
      // Submit to Google Forms invisibly
      const formData = new FormData();
      
      // Google Form field IDs extracted from your form
      formData.append('entry.157418142', message.substring(0, 500)); // Message field
      formData.append('entry.770169165', new Date().toLocaleString()); // Timestamp field
      formData.append('entry.2126914707', navigator.userAgent.substring(0, 100)); // Browser info field
      
      // Submit to Google Forms with your actual form ID
      const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc2h2fVXHmdUywhRQnTR4VSMMCcpqst5hH25AjEM_kAHewIEw/formResponse';
      
      // Use fetch with no-cors mode to avoid CORS issues
      await fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      
      // Since no-cors doesn't let us check response, assume success after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showStatus('Thank you! Your message has been submitted successfully.', 'success');
      form.reset();
      
      // Keep local backup for redundancy
      const guestbookEntry = {
        message: message.substring(0, 500),
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      const existingEntries = JSON.parse(localStorage.getItem('guestbookEntries') || '[]');
      existingEntries.push(guestbookEntry);
      localStorage.setItem('guestbookEntries', JSON.stringify(existingEntries));
      
    } catch (error) {
      console.error('Submission error:', error);
      
      // Fallback: still show success and store locally
      const guestbookEntry = {
        message: message.substring(0, 500),
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      const existingEntries = JSON.parse(localStorage.getItem('guestbookEntries') || '[]');
      existingEntries.push(guestbookEntry);
      localStorage.setItem('guestbookEntries', JSON.stringify(existingEntries));
      
      showStatus('Thank you! Your message has been submitted successfully.', 'success');
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
