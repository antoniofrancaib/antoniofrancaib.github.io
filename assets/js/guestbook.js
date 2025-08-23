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

    setLoading(true);
    
    try {
      // Use GitHub repository dispatch to trigger secure workflow
      const response = await fetch('https://api.github.com/repos/antoniofrancaib/antoniofrancaib.github.io/dispatches', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'guestbook-submission',
          client_payload: {
            name: 'Anonymous',
            message: message.substring(0, 500)
          }
        })
      });

      if (response.status === 204) {
        showStatus('Message sent successfully! Thank you.', 'success');
        form.reset();
        updateButtonState(); // Update button state after reset
      } else {
        throw new Error('Failed to submit message');
      }
      
    } catch (error) {
      console.error('Guestbook submission error:', error);
      showStatus('Failed to send message. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `guestbook-status guestbook-${type}`;
    setTimeout(() => {
      status.textContent = '';
      status.className = 'guestbook-status';
    }, 5000);
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    } else {
      submitBtn.textContent = 'Send';
      updateButtonState();
    }
  }

  // Initialize button state
  updateButtonState();
})();
