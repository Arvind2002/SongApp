const express=require('express')
const router=express.Router()
const {ensureAuth, ensureGuest}=require('../middleware/auth')
const Playlists=require('../models/playlists')
const Songs=require('../models/songs')

//Login page - GET /
router.get('/',ensureGuest,(req,res)=>{
    res.render('Login',{layout:"login"})
})

//Home page - GET /home
router.get('/home',ensureAuth,async(req,res)=>{
    try{
        const playlists= await Playlists.find({user: req.user.id}).lean()
        res.render('Home',{
            name: req.user.firstName,
            playlists
        })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
    
})




module.exports=router