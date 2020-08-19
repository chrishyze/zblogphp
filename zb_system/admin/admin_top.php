<?php if (!defined('ZBP_PATH')) {
    exit('Access denied');
} ?>
</head>
<body class="admin admin-<?php echo $action; ?>">
<header class="header">
    <div class="logo"><a href="<?php echo $bloghost; ?>" title="<?php echo htmlspecialchars($blogname); ?>" target="_blank"><img src="<?php echo $bloghost; ?>zb_system/image/admin/none.gif" alt="Z-Blog"/></a></div>
    <div class="user"> <a href="<?php echo $bloghost; ?>zb_system/cmd.php?act=MemberEdt&amp;id=<?php echo $zbp->user->ID; ?>" title="<?php echo $lang['msg']['edit']; ?>"><img src="<?php echo $zbp->user->Avatar; ?>" width="40" height="40" id="avatar" alt="Avatar" /></a>
      <div class="username"></i> <span><?php echo $zbp->user->LevelName; ?>：<?php echo $zbp->user->StaticName; ?></span></div>
      <div class="userbtn"><a class="profile" href="<?php echo $bloghost; ?>" title="" target="_blank"><i class="icon-globe2"></i> <span><?php echo $lang['msg']['return_to_site']; ?></span></a>&nbsp;&nbsp;<a class="logout" href="<?php echo BuildSafeCmdURL('act=logout'); ?>" title=""><i class="icon-power"></i> <span><?php echo $lang['msg']['logout']; ?></span></a></div>
    </div>
    <div class="menu">
      <ul id="topmenu"><?php ResponseAdmin_TopMenu(); ?>
      </ul>
    </div>
</header>
<?php require ZBP_PATH . 'zb_system/admin/admin_left.php'; ?>
<section class="main">
<?php
$zbp->GetHint();
