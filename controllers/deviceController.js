const uuid = require("uuid");
const ApiError = require("../error/ApiError");
const path = require("path");
const { Device } = require("../models/models");

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let filename = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", filename));

      const device = Device.create({
        name,
        price,
        brandId,
        typeId,
        img: filename,
      });
      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res) {
    let { typeId, brandId, limit, page } = req.query;
    let devicesList;

    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;

    if (!typeId && !brandId) {
      devicesList = await Device.findAndCountAll({ limit, offset });
    }

    if (typeId && !brandId) {
      devicesList = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }

    if (!typeId && brandId) {
      devicesList = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }

    if (typeId && brandId) {
      devicesList = await Device.findAndCountAll({
        where: { brandId, typeId },
        limit,
        offset,
      });
    }

    return res.json(devicesList);
  }

  async getById(req, res) {}
}

module.exports = new DeviceController();
