const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const listDao = require("../../dao/list-dao.js");
const userDao = require("../../dao/user-dao.js");


const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    userId: {type: "string"},
  },
  required: ["name", "content", "userId"],
  additionalProperties: false,
};

const changeRequestCreateSchema = {
  type: "object",
  properties: {
    description: { type: "string" },
    author: { type: "string" },
    changes: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            start: {
              type: "number",
            },
          },
        },
      ],
    },
  },
  required: ["description", "author", "changes"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let list = req.body;

    const validA = ajv.validate(changeRequestCreateSchema, {});

    // validate input
    const valid = ajv.validate(schema, list);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    list = listDao.create(list);
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
