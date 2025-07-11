import express from 'express';
import  Event  from '../models/Event.js';

const router = express.Router();

// Récupérer les événements 

router.get('/', async (req, res) => {
    try{
        const events = await Event.find();
        res.json(events);
    }catch(e) {
        res.status(500).json({ message: 'Erreur serveur', error: e.message });
    }
})

router.post('/', async (req,res) => {
    try {
        const { title, content, start, end} = req.body;
        const event = new Event({ title, content, start, end });
        await event.save() ;
        res.json(event);
    }catch (e) {
        res.status(500).json({ message: 'Erreur serveur', error: e.message });
    }
});

// Mettre à jour un événement
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        start: req.body.start,
        end: req.body.end
      },
      { new: true }
    )
    res.json(event)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

export default router ;