const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const userDao = require("../../dao/user-dao.js");
const listDao = require("../../dao/list-dao.js");
const itemDao = require("../../dao/item-dao.js");

const schema = {
  type: "object",
  properties: {
    listId: { type: "string" },
    userId: { type: "string"},
    itemId: {type: "string"},
    resolved: {type: "boolean"},
  required: ["listId", "userId"],
  additionalProperties: false,
}};

async function UpdateAbl(req, res) {
  try {
    let item = req.body;

    // validate input
    const valid = ajv.validate(schema, item);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check if user exists
    const user = userDao.get(item.userId);
    if (!user) {
      res.status(404).json({
        code: "userNotFound",
        message: `User ${item.userId} not found`,
      });
      return;
    }

    // check if list exists
    const list = listDao.get(item.listId);
    if (!list) {
      res.status(404).json({
        code: "listNotFound",
        message: `Shopping list ${item.listId} not found`,
      });
      return;
    }
    item.item = item.item || "null";

    if (item.item === "null") {
      itemDao.remove(item.userId, item.listId);
    } else {
      item = itemDao.update(item);
    }
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
