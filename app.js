const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const User = require('./userData')
require('dotenv').config()

const app = express()
mongoose
    .connect('mongodb://nodemailer:test1234@ds249137.mlab.com:49137/nodemailer-api1', { useNewUrlParser: true })
    .then(() => {
        console.log('mongodb connted')
    })
    .catch(e => console.log(e))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.post('/saveUserInfo', (req, res) => {
    const reqData = req.body
    User.findOne({name: reqData.name}).then(data => {
        if (data) {
            res.status(400).json({
                status: 'failed',
                msg: 'already existed',
            })
        } else {
            const newUser = new User({
                name: reqData.name,
                email: reqData.email,
                password: reqData.password,
            })
            newUser.save().then(data => {
                res.status(200).json({
                    status: 'succeed',
                    data,
                })
            })
        }
    })
})

app.post('/retrievePwd', (req, res) => {
    User.findOne({ name: req.body.name }).then(user => {
        if (!user) {
            res.status(400).json({
                state: 'failed',
                msg: '该用户不存在',
            })
        } else {
            // step 1
            let transporter = nodemailer.createTransport({
                service: 'qq',
                secure: true,
                auth: {
                    user: '734270721@qq.com', // 309595700@qq.com
                    pass: 'ztfqvwgnkzjqbbgj', // 123456
                },
            })

            // step 2
            let mailOptions = {
                from: '734270721@qq.com',
                to: req.body.email,
                subject: 'STRATAKI',
                text: 'time to sleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep',
            }

            // step 3
            transporter.sendMail(mailOptions).then(data => {
                    res.status(200).json({
                        state: 'suc',
                        msg: `密码已发送至您的邮箱${req.body.email}`,
                    })
            }).catch(err => {
                    res.status(400).json({
                        state: 'failed',
                        msg: err,
                    })
            })
        }
    })
})

const port = process.env.port || '8000'
app.listen(port, err => {
    if (err) {
        throw err
    }
    console.log(`port ${port} started ...`)
})
