let thisTimeout;
let running = false;

// fetch data from affimration API
// maybe have this function send update affirmation message to main
function fetchAffirmation() {
  fetch('https://www.affirmations.dev/')
    .then((response) => response.json())
    .then((data) => {
      chrome.storage.local.set({ affirmation: data.affirmation });
      console.log('Affirmation updated:', data.affirmation);
      chrome.notifications
        .create({
          type: 'basic',
          title: 'New Affirmation!',
          message: data.affirmation,
          priority: 2,
          iconUrl: 'icon.png',
        })
        .catch((error) => {
          console.error('Error fetching affirmation:', error);
          chrome.notifications.create({
            type: 'basic',
            title: 'ERROR',
            message: 'ERROR',
            iconUrl: 'icon.png',
            priority: 2,
          });
        });
    })
    .finally(() => {
      if (running) {
        thisTimeout = setTimeout(fetchAffirmation, 3000);
      }
    });
}

// listen for when main.js asks for affirmation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('get affirmation received');
  if (request.action == 'createNotification') {
    if (!running) {
      running = true;
      fetchAffirmation();
    }
    // thisTimeout = setTimeout(fetchAffirmation, 1000);
  } else if (request.action === 'stopNotification') {
    if (thisTimeout) {
      console.log('stop notifications');
      clearTimeout(thisTimeout);
      thisTimeout = null;
    }
    running = false;
  }
});
