import test, { Page } from '@playwright/test';
import { User } from '../models/user';
import { Constants } from '../utilities/constants';
import { Messages } from '../data/messages.data';
import { LoginLocators } from '../locators/login-locators';
import { step } from '../utilities/logging';
import { CommonPage } from './common-page';
import { AssertHelper } from './assert-helper-page'

export class LoginPage extends LoginLocators {

  commonPage: CommonPage;
  assertHelper: AssertHelper;
  constructor(page: Page) {
    super(page);
    this.commonPage = new CommonPage(page);
    this.assertHelper = new AssertHelper();
  }

  /**
   *  Logs in using the provided user credentials.
   * @param user An object containing the username and password for login.
   */
  @step('Log in with user credentials')
  async login(user: User): Promise<void> {
    await test.step(`Log in with username: ${user.username}`, async () => {
      await this.inputUsername.fill(user.username);
      await this.inputPassword.fill(user.password);
      await this.btnSubmit.click();
    });
  }

  /**
   * Asserts that the login was successful by checking the URL and the presence of a success message.
   */
  async expectSuccessfulLogin(): Promise<void> {
    await test.step('Verify successful login', async () => {
      await this.assertHelper.assertPageHasURL(this.page, Constants.SECURE_URL, 'User should be redirected to secure page');

      await this.assertHelper.assertElementContainsText(this.flashMessage, Messages.SUCCESS_MESSAGE,
        'Success message should be displayed'
      );
    });
  }
}
