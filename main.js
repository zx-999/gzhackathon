document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleContainer');
  toggleSwitch.addEventListener('change', () => {
    if (toggleSwitch.checked) {
      chrome.runtime.sendMessage({ action: 'createNotification' });
    } else {
      chrome.runtime.sendMessage({ action: 'stopNotification' });
    }
  });
});

