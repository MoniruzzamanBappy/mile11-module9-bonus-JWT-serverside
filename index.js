const express = require('express');

const app = express();

const jwt = require('jsonwebtoken');

require('dotenv').config();

const cors = require('cors');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized'})
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.TOKEN, (err, decoded)=>{
        if(err){
            return res.status(403).send({message: 'forbidden'})
        }
        req.decoded= decoded;
        next()
    })
}

app.get('/', (req, res)=>{
    res.send("JWT node code practice!")
});

app.post('/login' , (req, res)=>{
    const user = req.body;
    console.log(user);
    
    if(user.pass === '123456'){
        const accessToken = jwt.sign({email: user.email}, process.env.TOKEN, {expiresIn:'1h'})
        res.send({success: true,
        accessToken: accessToken
        })
    }
    else{
        res.send({success: false})

    }
})

app.get('/orders', verifyJWT, (req, res)=>{
    res.send([{id: 1, name: 'rahim', email: 'rahim@gmail.com', phone: '0178821345678'},
    {id: 2, name: 'karim', email: 'pokjnhbvc@gmail.com', phone: '01789876543'}])
})

app.listen(port, ()=>{
    console.log("listening to port", port);
})