import mongoose from 'mongoose' ;

const eventSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Le titre est requis']},
    content: String,
    start: { type: Date, required: [true, 'La date de début est obligatoire']},
    end :{ type: Date , required: [true, 'La date de fin est obligatoire']},

})

export default mongoose.model('Event', eventSchema);