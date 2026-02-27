
import express from 'express';
import { MemberService } from "./application/membersService";
import { ErrorRequestHandler } from 'express';
import { API, Commands } from '@dddforum/api/members';
import { Config } from '@dddforum/config';
import { UsersServiceAPI } from '../users/externalServices/ports/usersServiceAPI';

export class MembersController {
  private router: express.Router;

  constructor(
    private memberService: MemberService,
    private errorHandler: ErrorRequestHandler,
    private config: Config,
    private usersServiceAPI: UsersServiceAPI
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post("/new", this.usersServiceAPI.ensureAuthenticated, this.createMember.bind(this));
    this.router.get("/me", this.usersServiceAPI.ensureAuthenticated, this.getMemberDetails.bind(this));
  }

  private async createMember(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const commandOrError = Commands.CreateMemberCommand.fromRequest(req.user, req.body);
      if (!commandOrError.isSuccess()) {
        return res.status(401).json({
          success: false,
          error: commandOrError.getError()
        });
      }

      const result = await this.memberService.createMember(commandOrError.getValue());
      if (result.isSuccess()) {
        return res.status(200).json({
          success: true,
          data: result.getValue().toDTO(),
        } as API.CreateMemberAPIResponse);
      } else {
        return res.status(400).json({
          success: false,
          error: result.getError()
        } as API.CreateMemberAPIResponse);
      }
    } catch (err) {
      next(err);
    }
  }

  private async getMemberDetails(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
          data: undefined
        });
      }

      const result = await this.memberService.getMemberDetails(userId);
      
      if (result.isSuccess()) {
        const response: API.GetMemberDetailsAPIResponse = {
          success: true,
          data: result.getValue().toDTO(),
          error: undefined
        };
        return res.json(response);
      }

      const response: API.GetMemberDetailsAPIResponse = {
        success: false,
        data: undefined,
        error: result.getError()
      };
      return res.status(404).json(response);
    } catch (error) {
      next(error);
    }
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }
}
