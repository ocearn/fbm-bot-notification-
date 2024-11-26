document.getElementById('sendMessage').addEventListener('click', () => {
  const botToken = document.getElementById('botToken').value.trim();
  const chatIds = document.getElementById('chatIds').value.trim().split(',');
  const customMessage = document.getElementById('customMessage').value.trim();
  const fileInput = document.getElementById('fileUpload');
  const file = fileInput.files[0];

  // Collect buttons data
  const buttonRows = document.querySelectorAll('.button-row');
  const buttons = Array.from(buttonRows).map(row => {
    const name = row.querySelector('.button-name').value.trim();
    const link = row.querySelector('.button-link').value.trim();
    return { text: name, url: link };
  });

  // Validate inputs
  if (!botToken || !chatIds || !customMessage) {
    alert("Please fill in all required fields!");
    return;
  }

  // Loop through chatIds and send messages
  chatIds.forEach(chatId => {
    const payload = {
      chat_id: chatId.trim(),
      text: customMessage,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: []
      }
    };

    // Add buttons to the payload if any
    if (buttons.length > 0) {
      payload.reply_markup.inline_keyboard = buttons.map(button => [{
        text: button.text,
        url: button.url
      }]);
    }

    // Check if a file is uploaded
    if (file) {
      const formData = new FormData();
      formData.append("chat_id", chatId.trim());
      formData.append("photo", file);
      formData.append("caption", customMessage);  // The message will be the caption of the image
      formData.append("reply_markup", JSON.stringify(payload.reply_markup)); // Add buttons along with the image

      // Send image with caption and buttons
      fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          console.log(`Photo and buttons sent to Chat ID: ${chatId}`);
        } else {
          console.error(`Failed to send photo and buttons to Chat ID: ${chatId}`, data);
        }
      })
      .catch(error => console.error('Error:', error));
    } else {
      // Send text message with buttons
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          console.log(`Message with buttons sent to Chat ID: ${chatId}`);
        } else {
          console.error(`Failed to send message with buttons to Chat ID: ${chatId}`, data);
        }
      })
      .catch(error => console.error('Error:', error));
    }
  });

  alert("Messages sent!");
});

document.getElementById('addButton').addEventListener('click', () => {
  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';
  buttonRow.innerHTML = `
    <input type="text" class="button-name" placeholder="Enter button name">
    <input type="url" class="button-link" placeholder="Enter button link">
  `;
  document.getElementById('buttonInputs').appendChild(buttonRow);
});