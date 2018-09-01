import axios from 'axios';

export const NUM_REQUESTS = 100;

for (let i = 0; i < NUM_REQUESTS; i++) {
  setTimeout(() => {
    axios.get(`/api/endpoint/${i}`).then(() => {
      // do something to block the main thread for a short time
      setTimeout(() => {
        for (let j = 0; j < 1000; j++) {
          console.log(`request ${i} finished`);
        }
      });
    });
  }, 1000);
}