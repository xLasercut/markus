import { AbstractCommandHandler } from '../abtract';
import { simpleCommand } from '../command';
import { THandlerDependencies } from '../../interfaces/handler';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS } from '../../constants';
import { GachaDatabase } from '../../cache/gacha/gacha';

class AdminGachaDbUpdateHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('gacha_db_update', 'Uplift gacha database');
  protected _db: GachaDatabase;

  constructor(dependencies: THandlerDependencies) {
    super(dependencies, [], [dependencies.config.OWNER_USER_ID]);
    this._db = dependencies.gachaDatabase;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    this._db.updateDbSchema();
    await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(COLORS.SUCCESS).setDescription('Database updated')]
    });
  }
}

export { AdminGachaDbUpdateHandler };
