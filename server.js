/* eslint-disable */
const express = require('express');
import router from './routes/index';

const app = express();
app.use(router);
app.use(express.json());

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
