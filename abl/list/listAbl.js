const listDao = require("../../dao/list-dao.js");
const likedDao = require("../../dao/liked-dao.js");

async function ListAbl(req, res) {
  try {
    const listList = listDao.list();

    const likedMap = likedDao.listMap();

    listList.forEach((list) => {
      list.userMap = likedMap[list.id] || {};
    });

    res.json(listList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
