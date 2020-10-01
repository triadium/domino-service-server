import * as crypto from 'crypto';
import * as moment from 'moment';
import { isNil } from 'lodash';
import { Processor, Command, Delta, Pi } from '../../common/decorators';
import { IResultBox, ok, reason, REASONS } from '../../common/bases/api.types';
import { IStorage } from '../../storages/storage.types';
import { MongoConnection } from '../../storages/mongo.connection.provider';
import { API_VERSION, USER, SIGN_IN, CONFIRM } from '../command.names';
import { ReadQuery, USER_LIST_USER, Teta, USER_LIST_CONTACT, UNIT_ROLE_TYPE, KNOWN_IDS } from '../../storages/service/service.basis';
import { UserAuthorizeBox, UserAuthorizeConfirmBox } from '../../api/user/user.api.boxes';
import { gen8B2Ch } from '../../common/utils';
import { getContactType } from '../common/utility';
import { CODE_GEN_PAUSES_PAN as CODE_GEN_PAUSE_SPAN } from '../common/configuration';

@Processor(`${API_VERSION}${USER}`)
export class UserProcessor {
  private readonly _mainStorage: IStorage<UNIT_ROLE_TYPE>;
  private _d16: string;

  constructor(connection: MongoConnection) {
    this._mainStorage = connection.MAIN_STORAGE();
    this._d16 = 'ABCDEFGHJKMNPQRS';
  }

  private genCode(): string {
    const buf = crypto.randomBytes(3);
    let r = gen8B2Ch(buf[0], this._d16);
    for (let i = 1; i < buf.length; ++i) {
      r += gen8B2Ch(buf[i], this._d16);
    }
    return r;
  }

  /**
   * User registration in service
   * @param pi { IUserAuthorizeDto } Data for user registration
   * @description
   * 1. Check if contact exists in some user's contact lists
   *  y. Contact exists - return error "Contact is already in use"
   *  n. Contact does not exist -
   *    1. Check if data for user registration exists
   *      y. a) Time to re-generate the code has come, then go to generation process.
   *         b) Time to re-generate the code has not yet come - error "422 Unprocessable Entity"
   *      n. Go to generation process
   *  1. Create data for user registration
   *      a) Detect contact type - email or mobile
   *      b) Generate code
   *      c) Fix up time of code generation and code itself
   *  2. Send code through email or sms, depending on type
   *    a) Choose text template depending on type of contact
   *    b) Fill out template and send text using appropriate service
   */
  @Command(SIGN_IN)
  async signIn(@Pi() pi: UserAuthorizeBox): Promise<IResultBox> {

    const ctx = Teta.CreateContext();

    const rqe$UserContactExists = ReadQuery.USER_LIST()
                                            .USER()
                                            .where({ [USER_LIST_USER.contacts]: pi.contact })
                                            .limit(1).genQueryEta();
    const eta$UserContactExists = await this._mainStorage.read(rqe$UserContactExists);

    const teta$UserContactExists = ctx.USER_LIST(eta$UserContactExists);
    const ro$UserList$User = teta$UserContactExists.USER();
    if (ro$UserList$User.isEmpty()) {
      const rqe$ContactExists = ReadQuery.USER_LIST()
        .CONTACT().linkage([
          USER_LIST_CONTACT.type,
          USER_LIST_CONTACT.codeGenTimestamp,
          USER_LIST_CONTACT.codeGenPauseSpan,
        ])
        .where({ [USER_LIST_CONTACT.value]: pi.contact })
        .limit(1).genQueryEta();
      const eta$ContactExists = await this._mainStorage.read(rqe$ContactExists);
      const teta$ContactExists = ctx.USER_LIST(eta$ContactExists);
      const ro$ContactExists = teta$ContactExists.CONTACT();

      const now = moment.now();
      let teta$Contact;
      let la$Contact;
      if (ro$ContactExists.isEmpty()) {

        const contactType = getContactType(pi.contact);
        if (isNil(contactType) || (contactType !== 'email' && contactType !== 'mobile')) {
          return reason(REASONS.INVALID_CONTACT_TYPE);
        }
        // else { ok }

        teta$Contact = ctx.new.CONTACT();
        const za$Contact = teta$Contact.zeta.formAttributes();
        za$Contact.value = pi.contact;
        la$Contact = teta$Contact.USER_LIST().appendNullYota(teta$ContactExists.zeta.unique).formAttributes();
        la$Contact.value = pi.contact;
        la$Contact.type = contactType;
        la$Contact.codeGenPauseSpan = CODE_GEN_PAUSE_SPAN;
      }
      else {
        const yota$ContactExists = ro$ContactExists.getYota(0);
        la$Contact = yota$ContactExists.takeAttributes();
        if (now - la$Contact.codeGenTimestamp < la$Contact.codeGenPauseSpan) {
          return reason(REASONS.UNPROCESSABLE_ENTITY);
        }
        else{
          teta$Contact = ctx.new.CONTACT(yota$ContactExists.zeta.unique);
          teta$Contact.USER_LIST().appendNullYota(teta$ContactExists.zeta.unique).putAttributes(la$Contact);
        }
      }

      la$Contact.code = this.genCode();
      la$Contact.codeGenTimestamp = now;

      await this._mainStorage.write(teta$Contact);
      return ok();
    }
    else {
      return reason(REASONS.CONTACT_IN_USE);
    }
  }

  @Command(`${SIGN_IN}${CONFIRM}`)
  async signInConfirm(@Pi() pi: UserAuthorizeConfirmBox): Promise<IResultBox> {
    const ctx = Teta.CreateContext();

    const rqe$UserContactExists = ReadQuery.USER_LIST()
      .USER()
      .where({ [USER_LIST_USER.contacts]: pi.contact })
      .limit(1).genQueryEta();
    const eta$UserContactExists = await this._mainStorage.read(rqe$UserContactExists);

    const teta$UserContactExists = ctx.USER_LIST(eta$UserContactExists);
    const ro$UserList$User = teta$UserContactExists.USER();
    if (ro$UserList$User.isEmpty()) {
      const rqe$ContactExists = ReadQuery.USER_LIST()
        .CONTACT().linkage([
           USER_LIST_CONTACT.code,
        ])
        .where({ [USER_LIST_CONTACT.value]: pi.contact })
        .limit(1).genQueryEta();
      const eta$ContactExists = await this._mainStorage.read(rqe$ContactExists);
      const teta$ContactExists = ctx.USER_LIST(eta$ContactExists);
      const ro$ContactExists = teta$ContactExists.CONTACT();
      if (ro$ContactExists.isEmpty() || ro$ContactExists.getYota(0).attributes.code !== pi.code) {
        return reason(REASONS.UNPROCESSABLE_ENTITY);
      }
      else {
        //
      }
    }
    else {
      return reason(REASONS.CONTACT_IN_USE);
    }
    return ok();
  }
}