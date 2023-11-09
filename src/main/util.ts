import {join} from "path";
import icon from '../../resources/icon.png?asset'
import {is} from "@electron-toolkit/utils";

/**
 * 获取icon
 */
export function getIcon() {
    if (process.platform === 'linux') {
        return {icon}
    }
    if (process.platform == 'win32') {
        return {icon: join(__dirname, '../../resources/icon.ico')}
    }
    return {icon}
}

/**
 * 获取possible home目录地址
 */
export function getPossibleHome() {
    const USER_HOME = process.env.HOME || process.env.USERPROFILE || '~/'
    const dev = is.dev && process.env['ELECTRON_RENDERER_URL']
    // 检查possible_home变量是否存在
    return dev ? join(USER_HOME, '.possible-dev') : (process.env.POSSIBLE_HOME || join(USER_HOME, '.possible'))
}

/**
 * 获取家目录
 */
export function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE || '~/'
}
