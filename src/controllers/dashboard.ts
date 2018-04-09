import { default as Form, FormModel } from "../models/Form";
import { default as User, UserModel } from "../models/User";
import { Request, Response } from "express";

export let getDashboard = (req: Request, res: Response) => {
    Form.find({}).select({ "agentId": 1 }).populate("agentId", "-_id email name").exec((err, doc) => {
        if (err) {
            return res.redirect("/");
        }
        else {
            return res.render("dashboard", {
                title: "DashBoard",
                forms: doc
            });
        }
    });
};

