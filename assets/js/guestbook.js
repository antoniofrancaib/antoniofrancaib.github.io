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

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    
    if (!message) {
      showStatus('Please enter a message.', 'error');
      return;
    }

    // Create GitHub issue URL with pre-filled content
    const issueTitle = 'Guestbook entry from visitor';
    const issueBody = `**Message:**

${message.substring(0, 500)}

---
*Submitted via guestbook on ${new Date().toISOString().split('T')[0]}*`;

    const githubUrl = `https://github.com/antoniofrancaib/antoniofrancaib.github.io/issues/new?` +
      `title=${encodeURIComponent(issueTitle)}&` +
      `body=${encodeURIComponent(issueBody)}&` +
      `labels=guestbook`;

    // Show confirmation message
    showStatus('Opening GitHub to submit your message...', 'info');
    
    // Open GitHub issue creation page in new tab
    window.open(githubUrl, '_blank');
    
    // Clear form after a delay
    setTimeout(() => {
      form.reset();
      updateButtonState();
      showStatus('', '');
    }, 2000);
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
})();
