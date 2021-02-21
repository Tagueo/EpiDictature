/** @module logger */

import chalk from 'chalk';
import moment from 'moment';

type logColor = 'info' | 'error' | 'http' | 'success';

/**
 * Logs the provided text into the console with the date/hour and color fashion
 * @param { string } text text logged into the console
 * @param { logColor } color string representing context and giving the color used : info -> yellow, error -> red, http -> cyan, none -> blue
 */
export function logger(tag: string, text?: string, color?: logColor) {
  const date = `[${moment(Date.now()).format('DD/MM h:mm:ss')}]`

  let spacer = '';

  while (date.length+tag.length+2 > spacer.length) {
    spacer += ' '
  }

  if (text) {
    text = text.replace(/\n/g, `\n${spacer}`)
  } else {
    tag = tag.replace(/\n/g, `\n${spacer}`)
  }
  

  switch (color) {
    case 'info':
      console.info(`${chalk.yellow(date)} ${tag} ${text}`);
      break;
    case 'error':
      console.error(`${chalk.red(date)} ${tag} ${text}`);
      break;
    case 'http':
      console.info(`${chalk.blue(date)} ${chalk.gray(tag)} ${chalk.gray(text)}`);
      break;
    case 'success':
      console.info(`${chalk.greenBright(date)} ${tag} ${text}`);
      break;
    default:
      console.log(`${chalk.cyan(date)} ${tag} ${text}`);
  }
}