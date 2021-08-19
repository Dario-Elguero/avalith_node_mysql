const { server } = require('./src/app')
require('dotenv').config();
const { PORT } = process.env;

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at ${PORT}`);
});
