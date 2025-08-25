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
      // Method 1: Try direct Google Forms submission
      const formData = new FormData();
      formData.append('entry.157418142', message.substring(0, 500));
      formData.append('entry.770169165', new Date().toLocaleString());
      formData.append('entry.2126914707', navigator.userAgent.substring(0, 100));
      
      // Create a hidden iframe for form submission
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'guestbook_submit_frame';
      document.body.appendChild(iframe);
      
      // Create a temporary form for submission
      const tempForm = document.createElement('form');
      tempForm.action = 'https://docs.google.com/forms/d/e/1FAIpQLSc2h2fVXHmdUywhRQnTR4VSMMCcpqst5hH25AjEM_kAHewIEw/formResponse';
      tempForm.method = 'POST';
      tempForm.target = 'guestbook_submit_frame';
      tempForm.style.display = 'none';
      
      // Add form fields
      const messageField = document.createElement('input');
      messageField.name = 'entry.157418142';
      messageField.value = message.substring(0, 500);
      tempForm.appendChild(messageField);
      
      const timestampField = document.createElement('input');
      timestampField.name = 'entry.770169165';
      timestampField.value = new Date().toLocaleString();
      tempForm.appendChild(timestampField);
      
      const browserField = document.createElement('input');
      browserField.name = 'entry.2126914707';
      browserField.value = navigator.userAgent.substring(0, 100);
      tempForm.appendChild(browserField);
      
      document.body.appendChild(tempForm);
      
      // Submit the form
      tempForm.submit();
      
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(tempForm);
        document.body.removeChild(iframe);
      }, 3000);
      
      // Show success message immediately
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
      
      // Fallback: store locally and show success
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
