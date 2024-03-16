export default class UsersRepository {
  constructor(dao, mailModule) {
    this.dao = dao;
    this.mailModule = mailModule;
  }

  async sendGmailUpdatePassword(userId) {
    const user = await this.dao.getOneById(userId);

    let html = `You want update your password , for update your password <a href="/recoverPassword">Click Here</a>`;

    const result = await this.mailModule.send(user, "Change Password", html);
    return result;
  }

  async newUser(user) {
    return await this.dao.insert(user);
  }

  async findOneUserById(uid) {
    return await this.dao.getOneById(uid);
  }

  async findOneUserByGmail(email, lean = false) {
    return await this.dao.getOneByEmail(email, lean);
  }

  async updatePassword(uid, newPassword) {
    let user = await this.findOneUserById(uid);

    user.password = newPassword;

    return await this.dao.update(uid, user);
  }

  async updateLastConnection(id) {
    return await this.dao.update(id, { last_connection: Date.now() });
  }

  async updateRoleUser(uid) {
    //Change User to Premium or Premium to User
    let user = await this.findOneUserById(uid);

    if (user.role.toLowerCase() == "user") user.role = "premium";
    else if (user.role.toLowerCase() == "premium") user.role = "user";

    return await this.dao.update(uid, user);
  }
}
