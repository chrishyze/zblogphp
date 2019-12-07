<?php
/**
 * ZBPDK子扩展
 * EditorApi配置页.
 */
require_once '../../../../../zb_system/function/c_system_base.php';
require_once '../../../../../zb_system/function/c_system_admin.php';
header('Cache-Control: no-cache, must-revalidate');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('Pragma: no-cache');
$zbp->Load();
if (!$zbp->CheckRights('root')) {
    $zbp->ShowError(6);
    die();
}
if (!$zbp->CheckPlugin('ZBPDK')) {
    $zbp->ShowError(48);
    die();
}

//检测配置提交
if ('POST' == strtoupper($_SERVER['REQUEST_METHOD'])) {
    if (isset($_POST['show'])) {
        $zbp->Config('ZBPDK_EditorApi')->show = $_POST['show'];
    }
    $zbp->SaveConfig('ZBPDK_EditorApi');
}

require_once $blogpath . 'zb_system/admin/admin_header.php';
require_once $blogpath . 'zb_system/admin/admin_top.php';
?>

<div id="divMain">
    <div class="divHeader">
        <?php echo $blogtitle; ?>
    </div>
    <div class="SubMenu">
        <?php echo $zbpdk->submenu->export('EditorApi'); ?>
    </div>
    <div id="divMain2">
        <form id="edit" name="edit" method="post" action="main.php">
            <table border="1" class="tableFull tableBorder tableBorder-thcenter">
                <tr>
                    <th class="td25">项目</th>
                    <th>设置</th>
                    <th>说明</th>
                </tr>
                <tr>
                    <td>
                        <p><b>显示调试工具</b></p>
                    </td>
                    <td>
                        <p><input id="show" name="show" class="checkbox" type="text" value="<?php echo $zbp->Config('ZBPDK_EditorApi')->show; ?>"></p>
                    </td>
                    <td>
                        <p><span class="note">在编辑页面显示编辑器前端脚本 API 的调试工具。</span></p>
                    </td>
                </tr>
            </table>
            <hr>
            <input type="hidden" name="csrfToken" value="<?php echo $zbp->GetCSRFToken(); ?>">
            <p>
                <input type="submit" class="button" value="<?php echo $lang['msg']['submit'] ?>">
            </p>
        </form>

        <div class="eapi-intro">
            <h2>编辑器接口说明</h2>
            <p>编辑器接口是 Z-BlogPHP 官方定义的一个 Javascript 前端脚本接口，用于统一不同编辑器内部提供的四种主要操作，建议第三方应用通过该接口获取或设置编辑器当前内容。</p>
            <p>编辑器要自行去适配实现该接口，<strong>本扩展的主要作用就是测试编辑器是否适配该接口，以及外部是否能成功调用该接口等</strong>。</p>
            <p>全局变量 editor_api 中包含正文编辑器（editor.content）和摘要编辑器（editor.intro）两个对象，每个对象下提供四个方法，分别是 get() 获取编辑器内容，insert() 将指定内容插入编辑器光标处，put() 用指定内容替换编辑器的当前所有内容，focus() 使编辑器获取焦点。<br>以下是默认的功能细节：</p>
            <h3>editor_api.editor.content.get()</h3>
            <p>参数：无</p>
            <p>返回：{string} 编辑器的所有内容</p>
            <p>说明：获取当前正文编辑器的所有内容，通常是源代码，例如对于 HTML 编辑器将获得 HTML 代码，而 Markdown 编辑器就是 Markdown 代码。</p>
            <h3>editor_api.editor.intro.get()</h3>
            <p>参数：无</p>
            <p>返回：{string} 编辑器的所有内容</p>
            <p>说明：获取当前摘要编辑器的所有内容，通常是源代码。</p>
            <h3>editor_api.editor.content.insert(content)</h3>
            <p>参数：content {string} 要插入的内容</p>
            <p>返回：{undefined}</p>
            <p>说明：在正文编辑器的光标处插入指定内容。</p>
            <h3>editor_api.editor.intro.insert(content)</h3>
            <p>参数：content {string} 要插入的内容</p>
            <p>返回：{undefined}</p>
            <p>说明：在摘要编辑器的光标处插入指定内容。</p>
            <h3>editor_api.editor.content.put(content)</h3>
            <p>参数：content {string} 新的内容</p>
            <p>返回：{undefined}</p>
            <p>说明：将当前正文编辑器的所有内容替换为指定内容。</p>
            <h3>editor_api.editor.intro.put(content)</h3>
            <p>参数：content {string} 新的内容</p>
            <p>返回：{undefined}</p>
            <p>说明：将当前摘要编辑器的所有内容替换为指定内容。</p>
            <h3>editor_api.editor.content.focus()</h3>
            <p>参数：无</p>
            <p>返回：{undefined}</p>
            <p>说明：使正文编辑器获得焦点，默认使光标位于内容末尾。</p>
            <h3>editor_api.editor.intro.focus()</h3>
            <p>参数：无</p>
            <p>返回：{undefined}</p>
            <p>说明：使摘要编辑器获得焦点，默认使光标位于内容末尾。</p>
            <br>
            <p>接口实现请参考官方 UEditor 位于 zb_users/plugin/UEditor/include.php 的源码。</p>
            <p>更多详情请参阅位于 zb_system/admin/edit.php 中的源码。</p>
        </div>
    </div>
</div>

<style>
.eapi-intro {
  margin-bottom: 50px;
}
.eapi-intro h3 {
  margin-bottom: .35em;
}
.eapi-intro pre {
  margin: 10px 0;
  padding: 10px;
  background: #efefef;
}
</style>

<script>
    ActiveTopMenu('zbpdk');
</script>
<script>
    AddHeaderIcon("<?php echo $bloghost . 'zb_users/plugin/ZBPDK/logo.png'; ?>");
</script>

<?php
require_once $blogpath . 'zb_system/admin/admin_footer.php';
RunTime();
?>
