import { RESPONSE_CODES } from "../../../config/constants";
import Logger from "../../helpers/logger";
import Services from "../../services/Admin/Users_Employees";
import { validator } from "../../helpers/schemaValidator";
import { verifyToken } from "../../helpers/jwt";
import { approveInfo, rejectInfo } from "../../validators/Admin/Admin";

export default class Users_Employees {
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

  async getUserEmp(req, res) {
    try {
      const { body } = req;
      const list = await this.services.getUserEmpList(body);

      if (list.count > 0) {
        return res.json({
          status: 1,
          message: "List of User Employees",
          code: RESPONSE_CODES.POST,
          data: list.rows,
          recordsTotal: list.count,
          recordsFiltered: list.count,
        });
      } else {
        return res.json({
          status: 0,
          message: "List of User Employees Not Found",
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
}
