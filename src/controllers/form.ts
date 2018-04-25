import async from "async";
import { default as Form, FormModel } from "../models/Form";
import { default as User, UserModel } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { WriteError, ObjectID } from "mongodb";
import { CONSTANTS } from "../util/constants";
import { constants } from "zlib";
const request = require("express-validator");

type ProofSelectionData = {
    identity: string[],
    address: string[],
    dob: string[]
};

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
    Form.findById(req.params.formId, (err, doc: FormModel) => {
        const FormSelections: ProofSelectionData = ProofSelection(doc.category);
        const formId: string = getFormId(doc._id.toString(), (doc as any).agentId.toString());
        res.render("formdetails", {
            title: "Form Details",
            form: doc,
            formId: formId,
            getOption: getOption,
            dateTransform: dateTransform,
            coaSelection: CONSTANTS.coaSelection,
            dobProofSelection: FormSelections.dob,
            addressProofSelection: FormSelections.address,
            identityProofSelection: FormSelections.identity,
            states: CONSTANTS.states
        });
    });
};

export let getProofSelection = (req: Request, res: Response) => {
    return res.send(
        ProofSelection(
            parseInt(req.params.index)
        )
    );
};

function ProofSelection(index: number): ProofSelectionData {
    switch (index) {
        case 0: return undefined;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8: {
            return {
                address: CONSTANTS.addressProofSelection,
                dob: CONSTANTS.dobProofSelection,
                identity: CONSTANTS.identityProofSelection
            };
        }
        case 9: {
            return {
                address: CONSTANTS.addressProofSelectionForAJP,
                dob: CONSTANTS.dobProofSelection,
                identity: CONSTANTS.identityProofSelection
            };
        }
        case 10: {
            return {
                address: CONSTANTS.addressProofSelectionForGovt,
                dob: CONSTANTS.dobProofSelection,
                identity: CONSTANTS.identityProofSelectionForGovt
            };
        }
        case 11: {
            return {
                address: CONSTANTS.addressProofSelectionForLLP,
                dob: CONSTANTS.dobProofSelection,
                identity: CONSTANTS.identityProofSelectionForLLP
            };
        }
    }
}

function getFormId(formId: string, agentId: string): string {
    const formRandomBit = parseInt(formId.substr(formId.length - 6), 16) % CONSTANTS.formIdNumber;
    const agentRandomBit = parseInt(agentId.substr(agentId.length - 6), 16) % CONSTANTS.formIdNumber;
    return "mrei-25544" + padNumber(formRandomBit, 5) + padNumber(agentRandomBit, 5);
}

function padNumber(n: number, len: number): string {
    let s = n.toString();
    const l = s.length;
    if (l < len) {
        for (let i = 0; i < (len - l); i++) {
            s = "0" + s;
        }
    }
    return s;
}