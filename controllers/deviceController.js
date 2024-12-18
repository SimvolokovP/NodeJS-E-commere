const uuid = require("uuid");
const ApiError = require("../error/ApiError");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
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

      if (info) {
        info = JSON.parse(info);
        info.forEach((infoEl) => {
          DeviceInfo.create({
            title: infoEl.title,
            description: infoEl.description,
            deviceId: device.id,
          });
        });
      }

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

  async getById(req, res) {
    const { id } = req.params;

    const targetDevice = await Device.findOne({
      where: { id },
      include: { model: DeviceInfo, as: "info" },
    });

    return res.json(targetDevice);
  }
}

module.exports = new DeviceController();
