import { RequestHandler } from "express";
import { pspList } from "../constants";

export const getPspListHandler: RequestHandler = async (req, res) => {
  const { listRequestedParam = "true" } = req.query;
  const listRequested = listRequestedParam === "true";

  if (!listRequested) {
    res.status(500).send();
    return;
  }

  res.send({
    data: pspList
  });
};
