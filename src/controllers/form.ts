import async from "async";
import { default as Form, FormModel } from "../models/Form";
import { default as User, UserModel } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { WriteError, ObjectID } from "mongodb";
const request = require("express-validator");


/**
 * GET /form
 * Form page.
 */
export let getForm = (req: Request, res: Response) => {
  if (req.user) {
    return res.render("form", {
        title: "Form"
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
    category: req.body.coa,
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
    PANCardName: req.body.nameOnCard,
    dob: req.body.dob,
    contactNumber: {
        ISDCode: req.body.contactISD,
        STDCode: req.body.contactSTD,
        number: req.body.contactNo
    },
    email: req.body.email,
    addressForCommunication: req.body.aoc,
    dispatchState: req.body.dispatchState,
    AorE: req.body.AorE,
    aadhaarNumber: req.body.aadhaarNo,
    RAAddress: req.body.raAddress,
    proof: {
        identity: req.body.proofIdentity,
        address: req.body.proofAddress,
        dob: req.body.proofDOB
    },
    fee: parseInt(req.body.fee)
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
        if (doc.balance < parseInt(req.body.fee)) {
            req.flash("error", { msg: "Not Enough Balance" });
            return res.redirect("/form");
        }
        else {
            doc.balance = doc.balance - parseInt(req.body.fee);
            doc.save();
            req.flash("success", { msg: "Form Submited" });
            return res.redirect("/form");
        }
    });
  });
};

export let getFormPDF = (req: Request, res: Response) => {
    Form.findById(req.params.formId, (err, doc) => {
        res.send(doc);
    });
};