import { window, CodeAction, CodeActionProvider, CodeActionKind } from "coc.nvim";
import { getSelectedText } from "../utils";

const blocListenerRegExp = new RegExp("^BlocListener(\\<.*\\>)*\\(.*\\)", "ms");
const blocProviderRegExp = new RegExp(
  "^BlocProvider(\\<.*\\>)*(\\.value)*\\(.*\\)",
  "ms"
);
const repositoryProviderRegExp = new RegExp(
  "^RepositoryProvider(\\<.*\\>)*(\\.value)*\\(.*\\)",
  "ms"
);

export class BlocCodeActionProvider implements CodeActionProvider {
  public provideCodeActions(): CodeAction[] {
    const editor = window.activeTextEditor;
    if (!editor) return [];

    const selectedText = editor.document.getText(getSelectedText(editor));
    if (selectedText === "") return [];

    const isBlocListener = blocListenerRegExp.test(selectedText);
    const isBlocProvider = blocProviderRegExp.test(selectedText);
    const isRepositoryProvider = repositoryProviderRegExp.test(selectedText);

    return [
      ...(isBlocListener
        ? [
          {
            command: "bloc.convert-multibloclistener",
            title: "Convert to MultiBlocListener",
          },
        ]
        : []),
      ...(isBlocProvider
        ? [
          {
            command: "bloc.convert-multiblocprovider",
            title: "Convert to MultiBlocProvider",
          },
        ]
        : []),
      ...(isRepositoryProvider
        ? [
          {
            command: "bloc.convert-multirepositoryprovider",
            title: "Convert to MultiRepositoryProvider",
          },
        ]
        : []),
      {
        command: "bloc.wrap-blocbuilder",
        title: "Wrap with BlocBuilder",
      },
      {
        command: "bloc.wrap-blocselector",
        title: "Wrap with BlocSelector",
      },
      {
        command: "bloc.wrap-bloclistener",
        title: "Wrap with BlocListener",
      },
      {
        command: "bloc.wrap-blocconsumer",
        title: "Wrap with BlocConsumer",
      },
      {
        command: "bloc.wrap-blocprovider",
        title: "Wrap with BlocProvider",
      },
      {
        command: "bloc.wrap-repositoryprovider",
        title: "Wrap with RepositoryProvider",
      },
    ].map((c) => {
      let action = new CodeAction(c.title, CodeActionKind.Refactor);
      action.command = {
        command: c.command,
        title: c.title,
      };
      return action;
    });
  }
}