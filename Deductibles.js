import { RESPONSE_CODES } from "../../../config/constants";
import Logger from "../../helpers/logger";
import Services from "../../services/Admin/Deductibles";
import { validator } from "../../helpers/schemaValidator";
import { verifyToken } from "../../helpers/jwt";
import { approveInfo, rejectInfo } from "../../validators/Admin/Admin";

export default class Deductibles {
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

  async createDeductibles(req, res) {
    try {
      const { body } = req;
      const response = await this.services.createDeductibles(body);
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
          message: "Deductible listing",
          data: user,
          code: RESPONSE_CODES.POST,
        });
      } else {
        return res.json({
          status: 0,
          message: "Deductible List Not Found",
          code: RESPONSE_CODES.POST,
        });
      }
    } catch (error) {
      return res.status(RESPONSE_CODES.ERROR).json({
        error,
      });
    }
  }

  async getDeductibles(req, res) {
    try {
      const { body } = req;
      const list = await this.services.getDeductiblesList(body);

      if (list.count > 0) {
        return res.json({
          status: 1,
          message: "List of Deductible",
          code: RESPONSE_CODES.POST,
          data: list.rows,
          recordsTotal: list.count,
          recordsFiltered: list.count,
        });
      } else {
        return res.json({
          status: 0,
          message: "List of Deductibles Not Found",
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

  async getDeductiblesById(req, res) {
    try {
      const { params } = req;

      const response = await this.services.getDeductible(params);
      return res.json({
        status: 1,
        message: "Detail of Deductible",
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
      const response = await this.services.updateDeductible(body, params.id);
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

      const response = await this.services.deleteDeductible(params);
      return res.json({
        status: 1,
        message: "Deductible Succesfully Deleted",
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
