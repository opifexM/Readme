export enum RabbitRouting {
  AddSubscriber = 'subscriber.add',
  ChangePassword = 'password.change',
}

export enum RabbitExchange {
  Default = 'readme.notification'
}

export enum RabbitQueue {
  NewSubscriber = 'newSubscriber.queue',
  PasswordChange = 'passwordChange.queue',
}
