/**
 * Debugger script
 */
"use strict";
if (!window.jQuery) {
    //纯js版本，兼容现代浏览器
    const document_ready = () => {
        const debug_modal = document.getElementById("debug-container");
        if (debug_modal) {
            /**
             * 从localStorage获取并设置初始状态
             */
            //TAB位置
            const tab_index = parseInt(localStorage.getItem("zbpdk_debugger_tabindex"));
            if (!isNaN(tab_index) && tab_index >= 0 && tab_index < 5) {
                document.querySelector("#debug-tabs li:nth-of-type(" + (tab_index + 1) + ")").classList.add("debug-tab-on");
                document.querySelector("#debug-content li:nth-of-type(" + (tab_index + 1) + ")").style.display = "block";
            } else {
                document.querySelector("#debug-tabs>li:first-child").classList.add("debug-tab-on");
                document.querySelector("#debug-content>li:first-child").style.display = "block";
            }

            //调试器窗口大小
            const debugger_size = localStorage.getItem("zbpdk_debugger_size");
            if (typeof debugger_size == "string" && debugger_size == "true") {
                const size_ctl = document.getElementById("debug-ctl-size");
                debug_modal.style.height = "100%";
                size_ctl.innerHTML = "&or;";
                size_ctl.setAttribute("title", "收起");
            }

            //调试器显示状态
            const debugger_show = localStorage.getItem("zbpdk_debugger_show");
            if (typeof debugger_show == "string" && debugger_show == "true") {
                const show_ctl = document.getElementById("debug-ctl-show");
                debug_modal.style.display = "block";
                show_ctl.innerHTML = "●";
                show_ctl.setAttribute("title", "取消固定");
            }

            /**
             * 绑定点击事件
             * 记录显示状态并储存至localStorage
             */
            const html_dom = document.getElementsByTagName("html")[0];
            //打开按钮
            document.getElementById("debug-ctl-open").addEventListener("click", () => {
                debug_modal.style.display = "block";
                if (localStorage.getItem("zbpdk_debugger_size") == "true") {
                    html_dom.style.overflow = "hidden";
                }
            });

            //关闭按钮
            document.getElementById("debug-ctl-close").addEventListener("click", () => {
                debug_modal.style.display = "none";
                if (localStorage.getItem("zbpdk_debugger_size") == "true") {
                    html_dom.style.overflow = "auto";
                }
            });

            //固定显示按钮
            document.getElementById("debug-ctl-show").addEventListener("click", (e) => {
                if (e.target.innerText == "○") {
                    e.target.innerHTML = "●";
                    e.target.setAttribute("title", "取消固定");
                    localStorage.setItem("zbpdk_debugger_show", true);
                } else {
                    e.target.innerHTML = "○";
                    e.target.setAttribute("title", "固定");
                    localStorage.setItem("zbpdk_debugger_show", false);
                }
            });

            //窗口大小调整按钮
            document.getElementById("debug-ctl-size").addEventListener("click", (e) => {
                if (e.target.innerText == "∧") {
                    debug_modal.style.height = "100%";
                    e.target.innerHTML = "&or;";
                    e.target.setAttribute("title", "收起");
                    html_dom.style.overflow = "hidden";
                    localStorage.setItem("zbpdk_debugger_size", true);
                } else {
                    debug_modal.style.height = "50%";
                    e.target.innerHTML = "&and;";
                    e.target.setAttribute("title", "展开");
                    html_dom.style.overflow = "auto";
                    localStorage.setItem("zbpdk_debugger_size", false);
                }
            });

            //TAB按钮
            document.querySelectorAll("#debug-tabs li").forEach((element) => {
                element.addEventListener("click", (el) => {
                    if (!el.target.classList.contains("debug-tab-on")) {
                        let siblings = Array.from(el.target.parentElement.children);
                        let index = siblings.indexOf(el.target);
                        siblings.forEach((e) => {
                            e.classList.remove("debug-tab-on");
                        });
                        el.target.classList.add("debug-tab-on");
                        document.querySelectorAll("#debug-content li").forEach((e) => {
                            e.style.display = "none";
                        });
                        document.querySelector("#debug-content li:nth-of-type(" + (index + 1) + ")").style.display = "block";
                        localStorage.setItem("zbpdk_debugger_tabindex", index);
                    }
                });
            });
        }

        //AJAX获取接口详情
        document.querySelectorAll(".debug-plg-detail").forEach((element) => {
            element.addEventListener("click", () => {
                if (element.classList.contains("debug-plg-detail-show")) {
                    element.parentElement.parentElement.nextElementSibling.style.display = "none";
                } else {
                    let xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = (e) => {
                        if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
                            element.parentElement.parentElement.nextElementSibling.children[0].innerHTML = JSON.parse(e.currentTarget.responseText)[1];
                        }
                    };
                    xhttp.open("GET", window.bloghost + "zb_users/plugin/ZBPDK/extensions/Debugger/api.php?action=detail&interface=" + element.getAttribute("interface") + "&func=" + element.getAttribute("func"), true);
                    xhttp.send();
                    element.parentElement.parentElement.nextElementSibling.removeAttribute("style");
                }
                element.classList.toggle("debug-plg-detail-show");
            });
        });
    };
    if (document.readyState === "complete") {
        document_ready();
    } else {
        document.addEventListener("DOMContentLoaded", document_ready);
    }
} else {
    /**
     * jQuery版本，兼容性由jQuery版本决定
     * 代码结构与纯js版类似，注释请参照纯js版
      */
    $(function () {
        var $debug_modal = $("#debug-container");

        if ($debug_modal.length) {
            var tab_index = parseInt(localStorage.getItem("zbpdk_debugger_tabindex"));
            if (!isNaN(tab_index) && tab_index >= 0 && tab_index < 5) {
                $("#debug-tabs li:eq(" + tab_index + ")").addClass("debug-tab-on");
                $("#debug-content li:eq(" + tab_index + ")").css("display", "block");
            } else {
                $("#debug-tabs>li:first-child").addClass("debug-tab-on");
                $("#debug-content>li:first-child").css("display", "block");
            }

            var debugger_size = localStorage.getItem("zbpdk_debugger_size");
            if (typeof debugger_size == "string" && debugger_size == "true") {
                $debug_modal.css("height", "100%");
                $("#debug-ctl-size").html("&or;").attr("title", "收起");
                $("html").css("overflow", "hidden");
            }

            var debugger_show = localStorage.getItem("zbpdk_debugger_show");
            if (typeof debugger_show == "string" && debugger_show == "true") {
                $debug_modal.css("display", "block");
                $("#debug-ctl-show").html("●").attr("title", "取消固定");
            }

            $("#debug-ctl-open").click(function () {
                $debug_modal.css("display", "block");
                if (localStorage.getItem("zbpdk_debugger_size") == "true") {
                    $("html").css("overflow", "hidden");
                }
            });

            $("#debug-ctl-close").click(function () {
                $debug_modal.css("display", "none");
                if (localStorage.getItem("zbpdk_debugger_size") == "true") {
                    $("html").css("overflow", "auto");
                }
            });

            $("#debug-ctl-show").click(function () {
                if ($(this).text() == "○") {
                    $(this).html("●").attr("title", "取消固定");
                    localStorage.setItem("zbpdk_debugger_show", true);
                } else {
                    $(this).html("○").attr("title", "固定");
                    localStorage.setItem("zbpdk_debugger_show", false);
                }
            });

            $("#debug-ctl-size").click(function () {
                if ($(this).text() == "∧") {
                    $debug_modal.css("height", "100%");
                    $(this).html("&or;").attr("title", "收起");
                    $("html").css("overflow", "hidden");
                    localStorage.setItem("zbpdk_debugger_size", true);
                } else {
                    $debug_modal.css("height", "50%");
                    $(this).html("&and;").attr("title", "展开");
                    $("html").css("overflow", "auto");
                    localStorage.setItem("zbpdk_debugger_size", false);
                }
            });

            $("#debug-tabs li").click(function () {
                var index = $(this).index();
                $(this).siblings("li").removeClass("debug-tab-on");
                $(this).addClass("debug-tab-on");
                $("#debug-content").children("li").hide();
                $("#debug-content li:eq(" + index + ")").css("display", "block");
                localStorage.setItem("zbpdk_debugger_tabindex", index);
            });
        }

        $(".debug-plg-detail").click(function () {
            if ($(this).hasClass("debug-plg-detail-show")) {
                $(this).parents("tr").next("tr").hide();
            } else {
                var that = this;
                $.get(window.bloghost + "zb_users/plugin/ZBPDK/extensions/Debugger/api.php?action=detail&interface=" + $(this).attr("interface") + "&func=" + $(this).attr("func"), function (res) {
                    $(that).parents("tr").next("tr").children().html(res[1]);
                });
                $(this).parents("tr").next("tr").show();
            }
            $(this).toggleClass("debug-plg-detail-show");
        });
    });
}