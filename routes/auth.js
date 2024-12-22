const express=require('express')
const router=express.Router()
const passport=require('passport')

//Login page - GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//Callback - GET /google/callback
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'})
,(req,res)=>{
    res.redirect('/home')
})
router.get('/home',(req,res)=>{
    res.render('Home')
})

router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })

module.exports=router