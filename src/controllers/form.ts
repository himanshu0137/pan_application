import async from "async";
import { default as Form, FormModel } from "../models/Form";
import { default as User, UserModel } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { WriteError, ObjectID } from "mongodb";
const request = require("express-validator");
const dobProofSelection = [
    "Please Select",
    "Birth Certificate issued by the Municipal Authority or any office authorized to issue Birth and Death certificate by the registrar of Birth and Death of the Indian Consulate",
    "Pension payment order",
    "Marriage Certificate issued by Registrar of Marriages",
    "Marticulation Certificate",
    "Passport",
    "Driving Licence",
    "Domicile certificate issued by the Government",
    "Affidavit sworn before a magistrate, stating the date of birth",
    "Marticulation Marksheet of recognised board",
    "AADHAAR Card issued by the Unique Identification Authority of India",
    "Elector's photo identity card",
    "Photo identity card issued by Central Government or State Government Public Sector Undertaking",
    "Central Government Health Scheme Card",
    "Ex-Servicemen Contributory Health Scheme photo card"
];

const addressProofSelection = [
    "Please Select",
    "Latest property tax assesment order",
    "Depository account statement (Not more than 3 month old from date of application)",
    "Credit card statement (Not more than 3 month old from date of application)",
    "Bank Account statement/Passbook (Not more than 3 month old from date of application)",
    "Landline Telephone Bill (Not more than 3 month old from date of application)",
    "Certificate of Address signed by Municipal Councilor",
    "Driving Licence",
    "Passport",
    "Property Registration Document",
    "Electricity Bill (Not more than 3 month old from date of application)",
    "Bank Account Statement in the country of residence (Not more than 3 month old from date of application)",
    "Employer certificate in original",
    "Elector's photo identity card",
    "Certificate of Address Signed by a Gazetted Officer",
    "Passport of the spouse",
    "Post office passbook having address of the applicant",
    "Domicile certificate issued by the Government",
    "Allotment letter of accomodation issued by Central or State Government of not more than three year old",
    "Certificate of Address signed by a Member of Legislative Assembly",
    "Certificate of Address signed by a Member of Parliament",
    "AADHAAR Card issued by the Unique Identification Authority of India",
    "Consumer Gas connection card or book or piped gas bill (Not more than 3 month old from date of application)",
    "Water Bill (Not more than 3 month old from date of application)",
    "Broadband Connection bill (Not more than 3 month old from date of application)"
];

const identityProofSelection = [
    "Please Select",
    "Certificate of Address Signed by a Gazetted Officer",
    "Certificate of Address signed by a Member of Legislative Assembly",
    "Certificate of Address signed by a Member of Parliament",
    "Certificate of Address signed by Municipal Councilor",
    "Driving Licence",
    "Passport",
    "Arm's Licence",
    "Central Government Health Scheme Card",
    "Ex-Servicemen Contributory Health Scheme photo card",
    "Bank Certificate in original on letter head from the branch (along with name and stamp of the issuing officer) containing duly attested photograph and bank account number of the applicant",
    "Photo identity card issued by Central Government or State Government Public Sector Undertaking",
    "Pensioner Card having photograph of the applicant",
    "Elector's photo identity card",
    "Ration Card having photograph of the applicant",
    "AADHAAR Card issued by the Unique Identification Authority of India"
];

const states = [
    "Please Select",
    "ANDAMAN AND NICOBAR ISLANDS",
    "ANDHRA PRADESH",
    "ARUNACHAL PRADESH",
    "ASSAM",
    "BIHAR",
    "CHANDIGARH",
    "CHHATISGARH",
    "DADRA & NAGAR HAVELI",
    "DAMAN & DIU",
    "DELHI",
    "GOA",
    "GUJARAT",
    "HARAYANA",
    "HIMACHAL PRADESH",
    "JAMMU & KASHMIR",
    "JHARKHAND",
    "KARNATAKA",
    "KERALA",
    "LAKHWADEEP",
    "MADHYA PRADESH",
    "MAHARASHTRA",
    "MANIPUR",
    "MEGHALAYA",
    "MIZORAM",
    "NAGALAND",
    "OSHIDA",
    "OUTSIDE INDIA",
    "PONDICHERRY",
    "PUNJAB",
    "RAJASTHAN",
    "SIKKIM",
    "TAMIL NADU",
    "TELENGANA",
    "TRIPURA",
    "UTTAR PRADESH",
    "UTTARAKHAND",
    "WEST BENGAL"
];

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
        dobProofSelection: dobProofSelection,
        addressProofSelection: addressProofSelection,
        identityProofSelection: identityProofSelection,
        states: states
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
    }
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
        if (doc.balance < 110) {
            req.flash("error", { msg: "Not Enough Balance" });
            return res.redirect("/form");
        }
        else {
            doc.balance = doc.balance - 110;
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
            dobProofSelection: dobProofSelection,
            addressProofSelection: addressProofSelection,
            identityProofSelection: identityProofSelection,
            states: states
        });
    });
};