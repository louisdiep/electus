import app from './app';
import config from './config/config';
import { loadElectionDatabaseFromFile, loadUserDatabaseFromFile, loadSessionFromFile } from './data/dataStore';

// app.listen(config.port, () => {
//   console.log(`Server running on port ${config.port}`);
// });

const startServer = async () => {
  await loadUserDatabaseFromFile();
  await loadSessionFromFile();
  await loadElectionDatabaseFromFile();
  
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

