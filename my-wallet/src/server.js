const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/getTransactions', async (req, res) => {
    const { address } = req.query;

    try {
        const response = await axios.get(`https://api.etherscan.io/api?address=${address}&chain=goerli`, {
            headers: {
                'x-api-key': '2DHK4KC8TBHC15VZICEBETRIHIWPDQ4NWP',
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
