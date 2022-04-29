import { commands, ExtensionContext, languages, workspace } from 'coc.nvim';
import { analyzeDependencies } from './utils';
import { newBloc, newCubit } from './commands';
import { BlocCodeActionProvider } from "./code-actions";

import {
  newBloc,
  newCubit,
  // convertToMultiBlocListener,
  // convertToMultiBlocProvider,
  // convertToMultiRepositoryProvider,
  // wrapWithBlocBuilder,
  // wrapWithBlocListener,
  // wrapWithBlocConsumer,
  // wrapWithBlocProvider,
  // wrapWithRepositoryProvider,
  // wrapWithBlocSelector,
} from "./commands";

export async function activate(context: ExtensionContext): Promise<void> {
  if (workspace.getConfiguration('bloc').get<boolean>('checkForUpdates')) {
    analyzeDependencies();
  }

  context.subscriptions.push(
    commands.registerCommand('bloc.new-bloc', newBloc),
    commands.registerCommand('bloc.new-cubit', newCubit),
  );
}