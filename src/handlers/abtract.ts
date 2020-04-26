import {Message} from "discord.js"
import {logger} from '../app/init'
import {LOG_BASE} from '../app/logging'

class AbstractMessageHandler {
  protected _regex: RegExp
  protected _name: string

  constructor(name: string, regex: RegExp) {
    this._name = name
    this._regex = regex
  }

  public processMessage(message: Message): void {
    if (this._regex.exec(message.content)) {
      this._runWorkflow(message)
        .catch((error) => {
          logger.writeLog(LOG_BASE.SERVER002, {type: this._name, reason: error, message: message.content})
        })
    }
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    throw new Error('Not implemented')
  }
}

export {AbstractMessageHandler}
