const Ajv = require("ajv");
const ajv = new Ajv();
const fs = require("fs");
const path = require("path");
const listDao = require("../../dao/list-dao.js");
const userDao = require("../../dao/user-dao.js")

const schema = {
  type: "object",
  properties: {
    listId: { type: "string" },
    userId: {type: "string"}
  },
  required: ["listId", "userId"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
      // get request query or body
      const reqParams = req.body;
  
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
  
      // check if user exists
      const user = userDao.get(reqParams.userId);
      if (!user) {
        res.status(404).json({
          code: "userNotFound",
          message: `User ${reqParams.userId} not found`,
        });
        return;
      }
  
      // check if list exists
      const list = listDao.get(reqParams.listId);
      if (!list) {
        res.status(404).json({
          code: "listNotFound",
          message: `Shopping list ${reqParams.listId} not found`,
        });
        return;
      }
  
      function getUserForList(listId) {
        const listFilePath = path.join(__dirname, "../../dao/storage/listList", `${listId}.json`)
        try {
          // Read the JSON file
          const jsonData = fs.readFileSync(listFilePath, "utf-8");
      
          // Parse the JSON data into a JavaScript object
          const list = JSON.parse(jsonData);
      
          // Return the user who created the list
          return list.userId;
        } catch (error) {
          console.error(`Error reading or parsing shopping list file ${listId}.json:`, error);
          return null;
        }}

      // check if list is made by user
      const listUserId = getUserForList(reqParams.listId);
      if (listUserId === reqParams.userId) {
        // Proceed with deletion
  
        listDao.remove(reqParams.listId);
        res.json({ message: "List deleted successfully" });
      } else {
        res.status(400).json({
          code: "listNotMadeByUser",
          message: "cannot delete a shopping list created by a different user",
        });
      }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

 

module.exports = DeleteAbl;
