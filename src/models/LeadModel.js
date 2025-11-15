import mongoose, { Schema } from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    trim: true
  },
  email: {
    type: String,
    // required: true,
    trim: true
  },
  phone: {
  type: Number, 
  required: true,
  trim: true
},
  whatsAppNo:{
    type:String,
    // required:true,
  },
  departureCity:{
    type:String,
    // required:true,
  },
  destination:{
    // required:true,
    type:String,
  },
  expectedTravelDate:{
    type:Date,
    // required:true
  },
  noOfDays:{
    type:Number,
    // required:true,
  },
  placesToCover:{
    type:String,
    // required:true,
  },
  noOfPerson:{
    type:Number,
    // required:true
  },
  noOfChild:{
    type:Number,
    // required:true,
  },
  childAge:{
    type:String,
    // required:true
  },
  leadSource:{
    type:String,
    // required:true,
    // enum:['Meta','Instagram','Google','Just Dial']
    // enum:['Cold Call','Website','Referral','LinkedIn','Trade Show','Email Campaign','Social Media','Event','Organic Search','Paid Ads'],
  },
  leadType:{
    type:String,
    // required:true,
     required:false,
    // enum:['International','Domestic']
  },
  tripType:{
    type:String,
    // required:true,
    required:false,
    // enum:['Solo','Group','Family','Couple','Honeymoon']
  },
  company: {
    type: String,
    // required: true,
    trim: true
  },
  leadStatus: {
    type: String,
    enum: ['Hot', 'Warm', 'Cold', 'Converted', 'Lost'],
    default: 'Hot'
  },
  value: {
    type: String,
    // required: true
  },
 groupNumber:{
  type:String,
  require:false
 },
  lastContact: {
    type: Date,
    default: Date.now
  },
  // employeeLead:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"employeeLead"
  // },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;