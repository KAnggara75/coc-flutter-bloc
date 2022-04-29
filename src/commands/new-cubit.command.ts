import * as _ from "lodash";
import * as changeCase from "change-case";
import mkdirp = require("mkdirp");

import {
  Thenable,
  Uri,
  window,
  workspace,
} from "coc.nvim";
import { existsSync, lstatSync, writeFile } from "fs";
import { getCubitStateTemplate, getCubitTemplate } from "../templates";
import { getBlocType, BlocType, TemplateType } from "../utils";

export const newCubit = async (uri: Uri) => {
  const cubitName = await promptForCubitName();
  if (_.isNil(cubitName) || cubitName.trim() === "") {
    window.showErrorMessage("The cubit name must not be empty");
    return;
  }

  let targetDirectory: string;
  if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
    targetDirectory = await promptForTargetDirectory();
  } else {
    targetDirectory = uri.fsPath;
  }

  const blocType = await getBlocType(TemplateType.Cubit);
  const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
  try {
    await generateCubitCode(cubitName, targetDirectory, blocType);
    window.showInformationMessage(
      `Successfully Generated ${pascalCaseCubitName} Cubit`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForCubitName(): Thenable<string | undefined> {
  return workspace.callAsync('input', ['Cubit name (example: conter): ']);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  return workspace.callAsync('input', [
    'Where Folder path to create the cubit in (default: lib): ',
  ]);
}

async function generateCubitCode(
  cubitName: string,
  targetDirectory: string,
  type: BlocType
) {
  const libDir = 'lib';
  let targetDir = targetDirectory || libDir;
  const cubitDirectoryPath = `${targetDir}/cubit/${cubitName}`;
  if (!existsSync(cubitDirectoryPath)) {
    await createDirectory(cubitDirectoryPath);
  }

  await Promise.all([
    createCubitStateTemplate(cubitName, cubitDirectoryPath, type),
    createCubitTemplate(cubitName, cubitDirectoryPath, type),
  ]);
}

function createDirectory(targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(targetDirectory, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

function createCubitStateTemplate(
  cubitName: string,
  targetDirectory: string,
  type: BlocType
) {
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  const targetPath = `${targetDirectory}/${snakeCaseCubitName}_state.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseCubitName}_state.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(
      targetPath,
      getCubitStateTemplate(cubitName, type),
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      }
    );
  });
}

function createCubitTemplate(
  cubitName: string,
  targetDirectory: string,
  type: BlocType
) {
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  const targetPath = `${targetDirectory}/${snakeCaseCubitName}_cubit.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseCubitName}_cubit.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(
      targetPath,
      getCubitTemplate(cubitName, type),
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      }
    );
  });
}