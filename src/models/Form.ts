import mongoose from "mongoose";
import { ObjectId, ObjectID } from "bson";

const formSchema = new mongoose.Schema({
    agentId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    category: { type: String, default: "Individual" },
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
    addressForCommunication: {type: String, default: "INDIAN"},
    nameOnAadhaar: String,
    dispatchState: String,
    AorE: String,
    aadhaarNumber: String,
    RAAddress: {type: String, default: "INDIAN"},
    proof: {
        identity: String,
        address: String,
        dob: String
    },
    fee: Number
  }, { timestamps: true });

  export type FormModel = mongoose.Document &  {
    id: ObjectId,
    category: string,
    date: Date,
    name: {
        first: string,
        last: string,
        middle: string
    },
    fatherName: {
        first: string,
        last: string,
        middle: string
    },
    PANCardName: string,
    dob: Date,
    contactNumber: {
        ISDCode: string,
        STDCode: string,
        number: string
    },
    email: string,
    addressForCommunication: string,
    nameOnAadhaar: string,
    dispatchState: string,
    AorE: string,
    aadhaarNumber: string,
    RAAddress: string,
    proof: {
        identity: string,
        address: string,
        dob: string
    },
    fee: number
  };

const Form = mongoose.model("Form", formSchema);
export default Form;