import { default as Form, FormModel } from "../models/Form";
import { default as User, UserModel } from "../models/User";
import { Request, Response } from "express";
import { ObjectId } from "bson";


const dateTransform = (date: Date) => {
    if (date)
        return date.toDateString();
    return "";
};
export let getDashboard = (req: Request, res: Response) => {
    let findOption = {};
    if (req.user.role == 2) {
        findOption = {"agentId": new ObjectId(req.user.id)};
    }
    Form.find(findOption).select({"agentId": 1, "nameOnAadhaar": 1, "date": 1}).populate("agentId", "-_id email name").sort("-date").exec((err, doc) => {
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