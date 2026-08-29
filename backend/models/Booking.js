import mongoose from 'mongoose';
const schema = new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
 hotel:{type:mongoose.Schema.Types.ObjectId,ref:'Hotel',required:true},
 hotelName:{type:String,required:true}, location:{type:String,required:true}, latitude:Number, longitude:Number,
 checkIn:{type:Date,required:true}, checkOut:{type:Date,required:true}, guests:{type:Number,required:true,min:1}, totalPrice:{type:Number,required:true}, status:{type:String,enum:['Confirmed','Cancelled'],default:'Confirmed'}
},{timestamps:true});
export default mongoose.model('Booking',schema);
