import async from "async";
import { default as Form, FormModel } from "../models/Form";
import { default as User, UserModel } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { WriteError, ObjectID } from "mongodb";
import { CONSTANTS } from "../util/constants";
import { constants } from "zlib";
const request = require("express-validator");

const dateTransform = (date: Date) => {
    if (date)
        return date.toDateString();
    return "";
};

const getOption = (index: number, array: Array<string>) => {
    if (index > 0)
        return array[index];
    return "";
};
export let getForm = (req: Request, res: Response) => {
  if (req.user) {
    return res.render("form", {
        title: "Form",
        coaSelection: CONSTANTS.coaSelection,
        dobProofSelection: CONSTANTS.dobProofSelection,
        addressProofSelection: CONSTANTS.addressProofSelection,
        identityProofSelection: CONSTANTS.identityProofSelection,
        states: CONSTANTS.states
    });
  }
  else {
      res.redirect("/");
  }
};

export let postForm = (req: Request, res: Response, next: NextFunction) => {

    const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/form");
  }
  const form = new Form({
    agentId: new ObjectID(req.user.id),
    category: parseInt(req.body.coa),
    date: req.body.formDate,
    name: {
        first: req.body.applicantFirstName,
        last: req.body.applicantLastName,
        middle: req.body.applicantMiddleName
    },
    fatherName: {
        first: req.body.fatherFirstName,
        last: req.body.fatherLastName,
        middle: req.body.fatherMiddleName
    },
    nameOnAadhaar: req.body.napa,
    PANCardName: req.body.nameOnCard,
    dob: req.body.dob,
    contactNumber: {
        ISDCode: req.body.contactISD,
        STDCode: req.body.contactSTD,
        number: req.body.contactNo
    },
    email: req.body.email,
    addressForCommunication: req.body.aoc,
    dispatchState: parseInt(req.body.dispatchState),
    AorE: req.body.AorE,
    aadhaarNumber: req.body.aadhaarNo,
    RAAddress: req.body.raAddress,
    proof: {
        identity: parseInt(req.body.proofIdentity),
        address: parseInt(req.body.proofAddress),
        dob: parseInt(req.body.proofDOB)
    },
    fee: CONSTANTS.formPrice
  });
  form.save((err) => {
    if (err) { return next(err); }
    // req.logIn(user, (err) => {
    //   if (err) {
    //     return next(err);
    //   }
    // });
    User.findById(req.user.id, (err, doc: UserModel) => {
        if (err) {
            return next(err);
        }
        if (doc.balance < CONSTANTS.formPrice) {
            req.flash("error", { msg: "Not Enough Balance" });
            return res.redirect("/form");
        }
        else {
            doc.balance = doc.balance - CONSTANTS.formPrice;
            doc.save();
            req.flash("success", { msg: "Form Submited" });
            return res.redirect("/form");
        }
    });
  });
};

export let getFormPDF = (req: Request, res: Response) => {
    Form.findById(req.params.formId, (err, doc) => {
        res.render("formdetails", {
            title: "Form Details",
            form: doc,
            getOption: getOption,
            dateTransform: dateTransform,
            coaSelection: CONSTANTS.coaSelection,
            dobProofSelection: CONSTANTS.dobProofSelection,
            addressProofSelection: CONSTANTS.addressProofSelection,
            identityProofSelection: CONSTANTS.identityProofSelection,
            states: CONSTANTS.states
        });
    });
};