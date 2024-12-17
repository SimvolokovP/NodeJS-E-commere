const ApiError = require("../error/ApiError");
const { Brand } = require("../models/models");

class BrandController {
  async create(req, res) {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    return res.json(brand);
  }

  async getAll(req, res) {
    const brandList = await Brand.findAll();
    return res.json(brandList);
  }
}

module.exports = new BrandController();
