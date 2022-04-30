import { commands, ExtensionContext, workspace } from 'coc.nvim';
import { newBloc, newCubit } from './commands';
import { analyzeDependencies } from './utils';

export async function activate(context: ExtensionContext): Promise<void> {
  if (workspace.getConfiguration('bloc').get<boolean>('checkForUpdates')) {
    analyzeDependencies();
  }

  context.subscriptions.push(
    commands.registerCommand('bloc.new-bloc', newBloc),
    commands.registerCommand('bloc.new-cubit', newCubit)
  );
}

