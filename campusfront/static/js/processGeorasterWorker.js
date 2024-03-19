// Import the georaster library (included via Django settings)
importScripts('https://unpkg.com/georaster');

// Set up a message listener to receive data from the main thread
onmessage = (event) => {
  const arrayBuffer = event.data.arrayBuffer;

  // Perform georaster processing using the parseGeoraster function
  parseGeoraster(arrayBuffer).then((georaster) => {
    // Send the processed georaster data back to the main thread
    postMessage(georaster);
  });
};
