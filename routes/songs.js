const express=require('express')
const router=express.Router()
const {ensureAuth}=require('../middleware/auth')
const Songs=require('../models/songs')
const Playlists=require('../models/playlists')
  
  router.post('/',ensureAuth,async(req,res)=>{
    try {
        // checks if the given link is already present
        const existingSongs= await Songs.find({'link': req.body.link}).lean()
        if(existingSongs.length>0){
          res.render('error/songPresent')
         }
         else{
         await Songs.create(req.body)
         console.log(req.body)
         res.redirect('/songs')
         }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})
router.get('/', ensureAuth, async(req, res) => {
  try {
     const songs = await Songs.find({}).lean()
     
     //provide add, edit and delete button only for developers
     if(process.env.NODE_ENV === 'development'){
      res.render('SongsDev', {
        name: req.user.firstName,
        songs,
       })
      }
    else{
      res.render('Songs', {
        name: req.user.firstName,
        songs,
       })
    }  

  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
router.get('/add',ensureAuth,(req,res)=>{
    res.render('songs/add')

})

//delete route
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const song = await Songs.findById(req.params.id).lean()

    if (!song) {
      return res.render('error/404')
    }
    else {
      await Songs.remove({ _id: req.params.id })
      res.redirect('/songs')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//editing song details
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const song = await Songs.findOne({
      _id: req.params.id,
    }).lean()

    if (!song) {
      return res.render('error/404')
    }

    else {
      res.render('songs/edit', {
        song,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//Edit PUT request
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let song = await Songs.findById(req.params.id).lean()

    if (!song) {
      return res.render('error/404')
    }
    else {
      song = await Songs.findOneAndUpdate({_id:req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect(303,'/songs')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//play song
router.put('/play/:id', ensureAuth, async (req, res) => {
  try {
    let song = await Songs.findById(req.params.id).lean()
    
    if (!song) {
      return res.render('error/404')
    }
    else {
      const link=song.link
      let NumberOfPlays=song.NumberOfPlays
      NumberOfPlays+=1
      console.log(NumberOfPlays)
      song = await Songs.findOneAndUpdate({_id:req.params.id },{ $set: {NumberOfPlays:NumberOfPlays}}).lean()

      res.redirect(link)
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//adding song to playlist
router.get('/playlists/:id', ensureAuth, async (req, res) => {
  try {
    const song = await Songs.findOne({
      _id: req.params.id,
    }).lean()
    const playlist=await Playlists.find({}).lean()
    if (!song) {
      return res.render('error/404')
    }

    else {

      res.render('songs/playlist', {
        song,
        playlist
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//add songs to a playlist PUT request
router.put('/playlists/:id', ensureAuth, async (req, res) => {
  try {
    let song = await Songs.findById(req.params.id).lean()
    let playlist = await Playlists.findOne({Name:req.body.status}).lean()
    if (!song) {
      return res.render('error/404')
    }
     else {
      
      playlist = await Playlists.findOneAndUpdate({ Name:req.body.status },{ $push: { songs: song,}})
      playlist = await Playlists.findOneAndUpdate({_id:req.params.id },{ $set: {LastModified:Date.now()}}).lean()
      res.redirect('/songs')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports=router