import { RESPONSE_CODES } from '../../../config/constants';
import Logger from "../../helpers/logger";
import Services from '../../services/Admin/Users';
import { validator } from '../../helpers/schemaValidator';
import { verifyToken } from '../../helpers/jwt';
import { approveInfo, rejectInfo, getEmployeesById, BrokerDetail } from '../../validators/Admin/Admin';

export default class Users {
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
    async list(req, res) {
        try {
            const { body } = req;
            const user = await this.services.list(body);
            if (user.count > 0) {
                return res.json({
                    status: 1,
                    message: "List of user",
                    code: RESPONSE_CODES.POST,
                    data: user.rows,
                    recordsTotal: user.count,
                    recordsFiltered: user.count,
                });
            } else {
                return res.json({
                    status: 0,
                    message: "List of Users Not Found",
                    code: RESPONSE_CODES.POST,
                    data: [],
                    recordsTotal: user.count,
                    recordsFiltered: user.count,
                });
            }

        }
        catch (error) {
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }
    }


    async userDelete(req, res) {
        try {
            const { params } = req;
            const { isError, errors } = validator(params, getEmployeesById);
            if (isError) {
                return res.json({
                    status: 0,
                    message: errors,
                    code: RESPONSE_CODES.BAD_REQUEST,
                });
            }
            const response = await this.services.delete(params);
            return res.json({
                status: 1,
                message: "Succesfully Deleted",
                code: RESPONSE_CODES.DELETE,
            });

        } catch (error) {
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }
    }

    async userDeactive(req, res) {
        try {
            const { params, body } = req;
            const response = await this.services.diactive(params, body);
            if (response) {
                return res.json({
                    status: 1,
                    message: "Succesfully Deactivate",
                    code: RESPONSE_CODES.POST,
                });
            }

        } catch (error) {
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }
    }

    async approvedList(req, res) {
        try {
            const { body } = req;
            const user = await this.services.approvedlist(body);
            if (user.count > 0) {
                return res.json({
                    status: 1,
                    message: "List of Approved user",
                    code: RESPONSE_CODES.POST,
                    data: user.rows,
                    recordsTotal: user.count,
                    recordsFiltered: user.count,
                });
            } else {
                return res.json({
                    status: 0,
                    message: "List of Approved Users Not Found",
                    code: RESPONSE_CODES.POST,
                    data: [],
                    recordsTotal: user.count,
                    recordsFiltered: user.count,
                });
            }


        } catch (error) {
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }
    }



    async inprogressList(req, res) {
        try {
            const { body } = req;
            const user = await this.services.inprogresslist(body);
            if (user.count > 0) {
                return res.json({
                    status: 1,
                    message: "List of In Progress user",
                    code: RESPONSE_CODES.POST,
                    data: user.rows,
                    recordsTotal: user.count,
                    recordsFiltered: user.count,
                });
            } else {
                return res.json({
                    status: 0,
                    message: "List of In Progress Users Not Found",
                    code: RESPONSE_CODES.POST,
                    data: [],
                    recordsTotal: user.count,
                    recordsFiltered: user.count,
                });
            }


        } catch (error) {
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }
    }

    async list(req, res) {
        try {
            const { body } = req;
            const user = await this.services.userlist(body);
            if (user.count > 0) {
                return res.json({
                    status: 1,
                    message: "List of In Progress user",
                    code: RESPONSE_CODES.POST,
                    data: user.rows,
                    recordsTotal: user.count,
                    recordsFiltered: user.count,
                });
            } else {
                return res.json({
                    status: 0,
                    message: "List of In Progress Users Not Found",
                    code: RESPONSE_CODES.POST,
                    data: [],
                    recordsTotal: user.count,
                    recordsFiltered: user.count,
                });
            }


        } catch (error) {
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }
    }

    /*************************************************************************************** */
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * for Approved application
     */
    async approved(req, res) {
        try {
            const { headers: { authorization } } = req;
            const { body } = req;
            let token = authorization;
            const userToken = verifyToken(token);
            body.id = userToken.userId;
            const { isError, errors } = validator(body, approveInfo);
            if (isError) {
                return res.json({
                    status: 0,
                    message: errors,
                    code: RESPONSE_CODES.BAD_REQUEST
                });
            }
            const approved = await this.services.approveInfo(body);
            if (approved.status == 0) {
                return res.json({
                    status: approved.status,
                    message: approved.message,
                    code: RESPONSE_CODES.POST
                });
            } else {
                return res.json({
                    status: 1,
                    message: 'Informações de usuários aprovadas com sucesso',
                    code: RESPONSE_CODES.POST
                });
            }

        } catch (error) {
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }
    }

    /********************************************************************************* */
    /**
     * For Rejected Application of Broker
     * @param {} req 
     * @param {*} res 
     */
    async rejected(req, res) {
        try {
            const { headers: { authorization } } = req;
            const { body } = req;
            let token = authorization;
            const userToken = verifyToken(token);
            body.id = userToken.userId;
            const { isError, errors } = validator(body, rejectInfo);
            if (isError) {
                return res.json({
                    status: 0,
                    message: errors,
                    code: RESPONSE_CODES.BAD_REQUEST
                });
            }
            const detail = await this.services.reject(body);
            if (detail) {
                return res.json({
                    status: 1,
                    message: 'Sua inscrição foi rejeitada',
                    code: RESPONSE_CODES.POST
                });
            }
        } catch (error) {
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }

    }


    async CreateBroker(req, res) {
        try {
            const { headers: { authorization } } = req;
            const { body } = req;
            let token = authorization;
            const userToken = verifyToken(token);
            body.created_by_id = userToken.userId;
            const { isError, errors } = validator(body, BrokerDetail);
            if (isError) {
                return res.json({
                    status: 0,
                    message: errors,
                    code: RESPONSE_CODES.BAD_REQUEST
                });
            }
            const detail = await this.services.createbroker(body);
            if (detail) {
                return res.json({
                    status: detail.status,
                    message: detail.message,
                    code: RESPONSE_CODES.POST
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
