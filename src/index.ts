import { commands, ExtensionContext, workspace } from 'coc.nvim';
import { newBloc, newCubit, newBloc, newCubit } from "./commands";
import { analyzeDependencies } from './utils';
import { BlocCodeActionProvider } from "./code-actions";

export async function activate(context: ExtensionContext): Promise<void> {
  if (workspace.getConfiguration('bloc').get<boolean>('checkForUpdates')) {
    analyzeDependencies();
  }

  context.subscriptions.push(
    commands.registerCommand('bloc.new-bloc', newBloc),
    commands.registerCommand('bloc.new-cubit', newCubit)
  );
}