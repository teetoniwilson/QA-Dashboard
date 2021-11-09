const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Toniodev:800dM0rn!n8@cluster0-shw8n.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() =>{
	console.log('Connected to DB!');
}).catch(err=>{
	console.log("ERROR: ", err.message);
});

app.get('/', (req, res) => {res.send('Is this thing on, Is it?');
	 });

app.listen(3000, () => {console.log('server listening on port 3000');
	});