import { RESPONSE_CODES } from "../../../config/constants";
import Logger from "../../helpers/logger";
import Services from "../../services/Admin/Products";
import { validator } from "../../helpers/schemaValidator";
import { verifyToken } from "../../helpers/jwt";
import { approveInfo, rejectInfo } from "../../validators/Admin/Admin";

export default class Products {
  async init(db) {
    this.services = new Services();
    this.logger = new Logger();

    await this.services.init(db);
    await this.logger.init();
  }

  /********************************************************************************* */
  /**
   *
   * @param {*} req
   * @param {*} res
   * list of all brokers
   */

  async createProducts(req, res) {
    try {
      const { body } = req;
      const response = await this.services.createProducts(body);
      return res.json({
        status: response.status,
        message: response.message,
        code: response.code,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Ocorreu um erro. Tente mais tarde",
        code: RESPONSE_CODES.ERROR,
      });
    }
  }

  async listing(req, res) {
    try {
      const user = await this.services.list();
      if (user.length > 0) {
        return res.json({
          status: 1,
          message: "Products listing",
          data: user,
          code: RESPONSE_CODES.POST,
        });
      } else {
        return res.json({
          status: 0,
          message: "Products List Not Found",
          code: RESPONSE_CODES.POST,
        });
      }
    } catch (error) {
      return res.status(RESPONSE_CODES.ERROR).json({
        error,
      });
    }
  }

  async getProducts(req, res) {
    try {
      const { body } = req;
      const list = await this.services.getProductsList(body);

      if (list.count > 0) {
        return res.json({
          status: 1,
          message: "List of Products",
          code: RESPONSE_CODES.POST,
          data: list.rows,
          recordsTotal: list.count,
          recordsFiltered: list.count,
        });
      } else {
        return res.json({
          status: 0,
          message: "List of Products Not Found",
          code: RESPONSE_CODES.POST,
          data: [],
          recordsTotal: list.count,
          recordsFiltered: list.count,
        });
      }
    } catch (error) {
      return res.json({
        status: 0,
        message: "Ocorreu um erro. Tente mais tarde",
        code: RESPONSE_CODES.ERROR,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { params } = req;

      const response = await this.services.getProducts(params);
      return res.json({
        status: 1,
        message: "Detail of Product",
        data: response,
        code: RESPONSE_CODES.GET,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Ocorreu um erro. Tente mais tarde",
        code: RESPONSE_CODES.ERROR,
      });
    }
  }

  async update(req, res) {
    try {
      const { body, params } = req;
      const response = await this.services.updateProduct(body, params.id);
      return res.json({
        status: response.status,
        message: response.message,
        code: response.code,
        // data: response,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Ocorreu um erro. Tente mais tarde",
        code: RESPONSE_CODES.ERROR,
      });
    }
  }
  async delete(req, res) {
    try {
      const { params } = req;

      const response = await this.services.deleteProduct(params);
      return res.json({
        status: 1,
        message: "Products Succesfully Deleted",
        code: RESPONSE_CODES.DELETE,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Ocorreu um erro. Tente mais tarde",
        code: RESPONSE_CODES.ERROR,
      });
    }
  }
}
