const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.set('view engine','ejs')
const assert = require('assert')
const ShortURL = require('./models/url')
app.use(express.urlencoded({extended:false}))

app.get('/',async(req,res)=>{
    const allData = await ShortURL.find({} , { _id : 0})
    res.render('index',{shorturls : allData})
})
app.post('/short',async (req,res)=>{


    // //insert record
    // const record = new ShortURL({
    //     full: 'test'
    // })
    // await record.save()
    const fullurl = req.body.fullurl
    console.log('URL requested : ' , fullurl)
    const record = new ShortURL({
        full : fullurl
    })
    await record.save()
    res.redirect('/')
    
})
app.get('/:shortid' , async (req,res)=>{
    const shortid = req.params.shortid

    const data = await ShortURL.findOne({short : shortid})

    if (!data) {
        return res.sendStatus(404)
    }

    data.clicks++
   
  
    await data.save()
    res.redirect(data.full)
})
mongoose.connect('mongodb://localhost:27017/codedamn',{
    useNewUrlParser : true,
    useUnifiedTopology : true
})
mongoose.connection.on('open',()=> {
    app.listen(3000,()=> {
        console.log("server started")
    })

})
