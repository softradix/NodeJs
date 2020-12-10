import { RESPONSE_CODES } from '../../../config/constants';
import { refreshToken, setResponseToken, verifyToken } from '../../helpers/jwt';
import Logger from "../../helpers/logger";
import Services from '../../services/Admin/Auth';
import { validator } from '../../helpers/schemaValidator';
import { adminLoginSchema, adminRegisterSchema } from '../../validators/Admin/Admin';
import bcrypt from 'bcrypt';


export default class Auth {
    async init(db) {
        this.services = new Services();
        this.logger = new Logger();

        await this.services.init(db);
        await this.logger.init();
    }

    /************************************************************************* */
    /***
     * For admin create 
     */
    async create(req, res) {
        try {
            const { body } = req;
            const { isError, errors } = validator(body, adminRegisterSchema);

            if (isError) {
                return res.json({
                    status: 0,
                    message: errors,
                    code: RESPONSE_CODES.BAD_REQUEST
                });
            }
            const admin = await this.services.create(body);
            if (admin) {
                return res.json(admin);
            }
        }
        catch (error) {
            //this.logger.logError('User Registration Error', error);
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }
    }


    /***************************************************************************
     * Login Authentication of brokers
     */
    async login(req, res) {
        try {
            const { body } = req;
            const { isError, errors } = validator(body, adminLoginSchema);

            if (isError) {
                return res.json({
                    status: 0,
                    message: errors,
                    code: RESPONSE_CODES.BAD_REQUEST
                });
            }
            const user = await this.services.login(body);
            let token;
            if (user) {
                delete user.dataValues.password;
                delete user.dataValues.is_deleted;
                const { email, id, name, role_id } = user;
                token = refreshToken({
                    email: email,
                    userId: id,
                    role_id: role_id,
                    username: name
                });
                setResponseToken(res, token);
                return res.json({
                    status: 1,
                    message: 'Login efetuado com sucesso',
                    data: user,
                    token: token,
                    code: RESPONSE_CODES.POST
                });
            }
            return res.json({
                status: 0,
                message: 'nome de usuário ou senha inválidos',
                code: RESPONSE_CODES.UNAUTHORIZED
            });
        }
        catch (error) {
            return res.status(RESPONSE_CODES.ERROR).json({
                error
            });
        }
    }
}
