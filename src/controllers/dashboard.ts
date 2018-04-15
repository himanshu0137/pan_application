import { default as Form, FormModel } from "../models/Form";
import { default as User, UserModel } from "../models/User";
import { Request, Response } from "express";


const dateTransform = (date: Date) => {
    if (date)
        return date.toDateString();
    return "";
};
export let getDashboard = (req: Request, res: Response) => {
    Form.find({}).select({"agentId": 1, "nameOnAadhaar": 1, "date": 1}).populate("agentId", "-_id email name").exec((err, doc) => {
        if (err) {
            return res.redirect("/");
        }
        else {
            return res.render("dashboard", {
                title: "DashBoard",
                forms: doc,
                dateTransform: dateTransform
            });
        }
    });
};