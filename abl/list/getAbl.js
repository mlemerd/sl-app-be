const Ajv = require("ajv");
const ajv = new Ajv();
const listDao = require("../../dao/list-dao.js");
const itemDao = require("../../dao/item-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read list by given id
    const list = listDao.get(reqParams.id);
    if (!list) {
      res.status(404).json({
        code: "listNotFound",
        message: `List ${reqParams.id} not found`,
      });
      return;
    }

    const itemMap = itemDao.listMap();
    list.userMap = itemMap[reqParams.id] || {};

    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
