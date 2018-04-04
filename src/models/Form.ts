import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    category: { type: String, default: "Individual" }, // ise bhi enum
    date: {type: Date, default: Date.now()},
    name: {
        first: String,
        last: String,
        middle: {type: String, default: ""}
    },
    fatherName: {
        first: String,
        last: String,
        middle: {type: String, default: ""}
    },
    PANCardName: String,
    dob: Date,
    contactNumber: {
        ISDCode: {type: String, default: ""},
        STDCode: {type: String, default: ""},
        number: String
    },
    email: String,
    addressForCommunication: String, // ye aur RA address same hai kya
    nameOnAadhaar: String,
    dispatchState: String, // ise enum kar sakte hai kya
    // aadhaar/EID field mai kya hai
    aadhaarNumber: String,
    // ra address kya hai,
    proof: {
        identity: Number,
        address: Number,
        dob: Number
    },
    fee: Number,
    // Aur ye aadhaar authentication ka kya karna
  }, { timestamps: true });