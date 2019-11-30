<?php
/**
 * AJAX请求处理.
 */
require_once '../../../../../zb_system/function/c_system_base.php';
$zbp->Load();
if (!headers_sent()) {
    header('Content-Type: application/json;charset=utf-8');
}
if (!$zbp->CheckPlugin('ZBPDK')) {
    echo json_msg(false, '插件未启用!');
    die();
}
if (!$zbp->CheckRights('root')) {
    echo json_msg(false, '没有访问权限!');
    die();
}

if ('GET' == strtoupper($_SERVER['REQUEST_METHOD']) && isset($_GET['action'])) {
    if ('detail' == $_GET['action']) {
        $res = get_interface_detail($_GET['interface'], $_GET['func']);
        if (false !== strpos($res, 'Exception') && 0 == strpos($res, 'Exception')) {
            $res = '<p>' . $res . '</p><p>获取接口详情失败! </p><p><strong>interface</strong>: ' . $_GET['interface'] . '</p><p><strong>func</strong>:' . $_GET['func'] . '</p>';
        }
        echo json_msg(true, $res);
    } elseif ('get_subvar' == $_GET['action']) {
        $main_var = $_GET['main_var'];
        $sub_vars = array();
        $except_key = array('GLOBALS', 'main_var', 'sub_vars', 'key', 'value', 'except_key');
        foreach ($$main_var as $key => $value) {
            if (in_array($key, $except_key) || false !== stripos($key, 'Filter_')) {
                continue;
            }
            $sub_vars[] = (string) $key;
        }
        echo json_msg(true, $sub_vars);
    } elseif ('var_content' == $_GET['action']) {
        $main_var = $_GET['main_var'];
        $sub_var = $_GET['sub_var'];
        $variable = '';
        if ('zbp' === $main_var) {
            if ('0' === $sub_var) {
                var_dump($$main_var);
            } elseif (property_exists($$main_var, $sub_var)) {
                var_dump($$main_var->$sub_var);
            }
            $variable = ob_get_clean();
        } elseif ('GLOBALS' === $main_var) {
            if ('0' === $sub_var) {
                var_dump($$main_var);
            } elseif (array_key_exists($sub_var, $$main_var)) {
                var_dump($$main_var[$sub_var]);
            }
            $variable = ob_get_clean();
        }
        echo json_msg(true, htmlspecialchars($variable));
    } else {
        echo json_msg(false, '参数错误!');
    }
} else {
    echo json_msg(false, '非法请求!');
}

/**
 * 获取接口详情
 * SourceCode: PluginInterface @zsx.
 *
 * @param string $interface_name 接口名称
 * @param string $func_name      函数名称
 *
 * @return string
 */
function get_interface_detail($interface_name = '', $func_name = '')
{
    $str = '';

    try {
        $func = new ReflectionFunction($func_name);
    } catch (ReflectionException $e) {
        return 'Exception: ' . $e->getMessage();
    }
    $start = $func->getStartLine() - 1;
    $end = $func->getEndLine() - 1;
    $filename = $func->getFileName();
    $str .= '<p><strong>Interface</strong>: ' . $interface_name . '</p>';
    $str .= '<p><strong>FilePath</strong>: ' . $filename . '</p>';
    $str .= '<p><strong>StartLine</strong>: ' . $start . '</p>';
    $str .= '<p><strong>EndLine</strong>: ' . $end . '</p>';
    $str .= '<pre class="debug-pre">' . htmlspecialchars(implode('', array_slice(file($filename), $start, $end - $start + 1))) . '</pre>';

    return $str;
}

/**
 * JSON 响应
 * 避免中文转码 Unicode
 * 兼容 PHP5.2.0～PHP7.
 *
 * @param bool   $status  状态
 * @param string $message 消息
 *
 * @return string
 */
function json_msg($status, $message)
{
    if (version_compare(PHP_VERSION, '5.4.0', '<')) {
        $str = json_encode(array($status, $message));

        return preg_replace_callback('#\\\u([0-9a-f]{4})#i', 'get_matched_iconv', $str);
    } else {
        return json_encode(array($status, $message), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}

/**
 * 字符编码转换
 * 单独定义函数以兼容 PHP5.2.
 *
 * @param array $matchs
 *
 * @return string
 */
function get_matched_iconv($matchs)
{
    return iconv('UCS-2BE', 'UTF-8', pack('H4', $matchs[1]));
}
