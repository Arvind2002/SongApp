const express=require('express')
const router=express.Router()
const {ensureAuth}=require('../middleware/auth')

const Playlists=require('../models/playlists')
const Songs=require('../models/songs')

//Post request to handle add playlist
router.post('/',ensureAuth,async(req,res)=>{
    try {
        const existingPlaylist= await Playlists.find({'Name': req.body.Name,'user': req.user.id})
        console.log(existingPlaylist)
        // if(existingPlaylist.length==1){
        //     res.render('error/playlistPresent')
        //    }
        if(existingPlaylist.length>0){
            res.render('error/playlistPresent')
        }
        else
        {
            req.body.user = req.user.id
        await Playlists.create(req.body)
        res.redirect('/home')
            
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
        
    }
})

//add playlist GET route
router.get('/add',ensureAuth,async (req,res)=>{
    const songs = await Songs.find({}).lean()
    res.render('playlists/add',{
    songs
     })
})


router.get('/songs/:id', ensureAuth, async (req, res) => {
    const playlist = await Playlists.findById(req.params.id).lean()
    try {
        res.render('playlists/songs',
        playlist)
      }
     catch (err) {
      console.error(err)
      res.render('error/404')
    }
  })

  //editing playlist details
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const playlist = await Playlists.findOne({
      _id: req.params.id,
    }).lean()

    if (!playlist) {
      return res.render('error/404')
    }

    else {
      res.render('playlists/edit', {
        playlist,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//adding songs to playlist
router.get('/songs/add/:id',ensureAuth,async(req,res)=>{
  try{
    const playlist = await Playlists.findOne({
      _id: req.params.id,
    }).lean()
    const songs = await Songs.find({}).lean()
    if (!playlist) {
      return res.render('error/404')
    }

    else {
      res.render('playlists/addSongs', {
        playlist,
        songs
      })
    }
  }
  catch(err){
    console.error(err)
    return res.render('error/500')
  }
})


//Adding song POST request

router.post('songs/add/:id',ensureAuth,async(req,res)=>{
  try{
    const id=req.params.id
    let playlist=await Playlists.findById(id).lean()
    const song=await Songs.findOne(link=req.body.link)
    console.log(playlist)
    consile.log(song)
    res.redirect('/playlists/songs/add/:id')
  }
  catch(err){
    console.error(err)
    return res.render('error/500')
  }
})


//Edit PUT request
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let playlist = await Playlists.findById(req.params.id).lean()

    if (!playlist) {
      return res.render('error/404')
    }
    else {
        playlist = await Playlists.findOneAndUpdate({_id:req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })
      const date=Date.now()
      playlist = await Playlists.findOneAndUpdate({_id:req.params.id },{ $set: {LastModified:date}}).lean()
      res.redirect(303,'/home')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//deleting a playlist
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const playlist = await Playlists.findById(req.params.id).lean()

    if (!playlist) {
      return res.render('error/404')
    }
    else {
      await Playlists.remove({ _id: req.params.id })
      console.log(req.params.id)
      res.redirect('/home')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

router.get('/songs/:id1/:id2', ensureAuth, async (req, res) => {
  res.render('playlists/songs')
  })
  
  //deleting songs in a playlist
  router.delete('/songs/:id1/:id2', ensureAuth, async (req, res) => {
    try {
      let playlist = await Playlists.findById(req.params.id1).lean()
      if (!playlist) {
        return res.render('error/404')
      }
      else {
        const date=Date.now()
        playlist = await Playlists.findOneAndUpdate({_id:req.params.id1 },{ $set: {LastModified:date}}).lean()
        playlist = await Playlists.findOneAndUpdate({ _id:req.params.id1 },{ $pull: { songs:{_id: req.params.id2,}}}).lean()
        res.redirect('/playlists/songs/'+req.params.id1)
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })
  
module.exports=router