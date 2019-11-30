/**
 * Debugger script
 */
"use strict";
if (!window.jQuery) {
    //纯js版本，兼容现代浏览器
    const document_ready = () => {
        const debug_modal = document.getElementById("debug-container");
        if (debug_modal) {
            let config = {  //状态配置
                show: false,  //显示调试器窗口
                maximize: false,  //最大化调试器窗口
                tab_index: 0,  //主标签位置
                side_tab_index: 0  //运行信息标签位置
            },
            html_dom = document.getElementsByTagName("html")[0];

            //读取设置
            if (typeof localStorage !== "undefined") {
                let local_conf = JSON.parse(localStorage.getItem("zbpdk_debugger"));
                if (local_conf) {
                    config = local_conf;
                }
            }

            /**
             * 初始化标签位置
             *
             * @param {string} index_name 标签位置在配置中的属性名
             * @param {string} tab_selector 标签选择器
             * @param {string} content_selector 标签对应内容元素选择器
             * @param {function} display_style 内容元素display样式
             */
            let initTabSwitch = (index_name, tab_selector, content_selector, display_style) => {
                let tab_index = config[index_name];
                if (!isNaN(tab_index) && Number.isInteger(tab_index) && tab_index >= 0) {
                    document.querySelector(tab_selector + ">li:nth-of-type(" + (tab_index + 1) + ")").classList.add("debug-tab-on");
                    document.querySelector(content_selector + ">li:nth-of-type(" + (tab_index + 1) + ")").style.display = display_style(tab_index);
                }
            };

            //主标签位置初始化
            initTabSwitch("tab_index", "#debug-tabs", "#debug-content", (tab_index) => {
                return tab_index ? "block" : "flex";
            });

            //运行信息标签位置初始化
            initTabSwitch("side_tab_index", "#debug-side-tabs", "#debug-side-content", (tab_index) => {
                return "block";
            });

            //调试器窗口大小初始化
            if (config.maximize) {
                const size_ctl = document.getElementById("debug-ctl-size");
                debug_modal.style.height = "100%";
                size_ctl.innerHTML = "&or;";
                size_ctl.setAttribute("title", "收起");
            }

            //调试器显示状态初始化
            if (config.show) {
                const show_ctl = document.getElementById("debug-ctl-show");
                debug_modal.style.display = "block";
                show_ctl.innerHTML = "●";
                show_ctl.setAttribute("title", "取消固定");
            }

            //监听打开按钮
            document.getElementById("debug-ctl-open").addEventListener("click", () => {
                debug_modal.style.display = "block";
                if (config.maximize) {
                    html_dom.style.overflow = "hidden";
                }
            });

            //监听关闭按钮
            document.getElementById("debug-ctl-close").addEventListener("click", () => {
                debug_modal.style.display = "none";
                if (config.maximize) {
                    html_dom.style.overflow = "auto";
                }
            });

            //监听固定显示按钮
            document.getElementById("debug-ctl-show").addEventListener("click", (e) => {
                if (e.target.innerText == "○") {
                    e.target.innerHTML = "●";
                    e.target.setAttribute("title", "取消固定");
                    config.show = true;
                } else {
                    e.target.innerHTML = "○";
                    e.target.setAttribute("title", "固定");
                    config.show = false;
                }

                if (typeof localStorage !== "undefined") {
                    localStorage.setItem("zbpdk_debugger", JSON.stringify(config));
                }
            });

            //监听窗口大小调整按钮
            document.getElementById("debug-ctl-size").addEventListener("click", (e) => {
                if (e.target.innerText == "∧") {
                    debug_modal.style.height = "100%";
                    e.target.innerHTML = "&or;";
                    e.target.setAttribute("title", "收起");
                    html_dom.style.overflow = "hidden";
                    config.maximize = true;
                } else {
                    debug_modal.style.height = "50%";
                    e.target.innerHTML = "&and;";
                    e.target.setAttribute("title", "展开");
                    html_dom.style.overflow = "auto";
                    config.maximize = false;
                }

                if (typeof localStorage !== "undefined") {
                    localStorage.setItem("zbpdk_debugger", JSON.stringify(config));
                }
            });

            /**
             * 标签位置切换
             *
             * @param {string} index_name 标签位置在配置中的属性名
             * @param {string} tab_selector 标签选择器
             * @param {string} content_selector 标签对应内容元素选择器
             * @param {function} display_style 内容元素display样式
             */
            let tabSwitch = (index_name, tab_selector, content_selector, display_style) => {
                document.querySelectorAll(tab_selector + ">li").forEach((element) => {
                    element.addEventListener("click", (el) => {
                        if (!el.target.classList.contains("debug-tab-on")) {
                            let siblings = Array.from(el.target.parentElement.children);
                            let index = siblings.indexOf(el.target);
                            siblings.forEach((e) => {
                                e.classList.remove("debug-tab-on");
                            });
                            el.target.classList.add("debug-tab-on");
                            document.querySelectorAll(content_selector + ">li").forEach((e) => {
                                e.style.display = "none";
                            });
                            document.querySelector(content_selector + ">li:nth-of-type(" + (index + 1) + ")").style.display = display_style(index);
                            config[index_name] = index;
                            if (typeof localStorage !== "undefined") {
                                localStorage.setItem("zbpdk_debugger", JSON.stringify(config));
                            }
                        }
                    });
                });
            };

            //监听主标签切换
            tabSwitch("tab_index", "#debug-tabs", "#debug-content", (tab_index) => {
                return tab_index ? "block" : "flex";
            });

            //监听运行信息标签切换
            tabSwitch("side_tab_index", "#debug-side-tabs", "#debug-side-content", (tab_index) => {
                return "block";
            });

            //监听系统变量的主变量切换
            document.getElementById("debug-main-var").addEventListener("change", (el) => {
                if (!el.currentTarget.value) return;
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = (e) => {
                    if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
                        let sub_select = document.getElementById("debug-sub-var");
                        //移除现有的option
                        sub_select.options.length = 0;
                        //添加变量自身选项
                        sub_select.options.add(new Option("变量自身", "0"));
                        //添加属性/键值
                        JSON.parse(e.currentTarget.responseText)[1].forEach((sub_var) => {
                            sub_select.options.add(new Option(sub_var, sub_var));
                        });
                    }
                };
                xhttp.open("GET", window.bloghost + "zb_users/plugin/ZBPDK/extensions/Debugger/api.php?action=get_subvar&main_var=" + el.currentTarget.value);
                xhttp.send();
            });

            //查看变量
            document.getElementById("debug-var-submit").addEventListener("click", (el) => {
                let main_var = document.getElementById("debug-main-var").value,
                    sub_var = document.getElementById("debug-sub-var").value;
                if (!main_var) return;
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = (e) => {
                    if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
                        document.getElementById("debug-var-view").innerHTML = JSON.parse(e.currentTarget.responseText)[1];
                    }
                };
                xhttp.open("GET", window.bloghost + "zb_users/plugin/ZBPDK/extensions/Debugger/api.php?action=var_content&main_var=" + main_var + "&sub_var=" + sub_var);
                xhttp.send();
            });
        }

        //获取接口详情
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
    //jQuery版本，兼容性由jQuery版本决定
    $(function () {
        var $debug_modal = $("#debug-container");

        if ($debug_modal.length) {
            var config = {  //状态配置
                show: false,  //显示调试器窗口
                maximize: false,  //最大化调试器窗口
                tab_index: 0,  //主标签位置
                side_tab_index: 0  //运行信息标签位置
            };

            //读取设置
            if (typeof localStorage !== "undefined") {
                var local_conf = JSON.parse(localStorage.getItem("zbpdk_debugger"));
                if (local_conf) {
                    config = local_conf;
                }
            }

            /**
             * 初始化标签位置
             *
             * @param {string} index_name 标签位置在配置中的属性名
             * @param {string} tab_selector 标签选择器
             * @param {string} content_selector 标签对应内容元素选择器
             * @param {function} display_style 内容元素display样式
             */
            var initTabSwitch = function(index_name, tab_selector, content_selector, display_style) {
                var tab_index = config[index_name];
                if (!isNaN(tab_index) && tab_index >= 0) {
                    $(tab_selector + ">li:eq(" + tab_index + ")").addClass("debug-tab-on");
                    $(content_selector + ">li:eq(" + tab_index + ")").css("display", display_style(tab_index));
                }
            };

            //主标签位置初始化
            initTabSwitch("tab_index", "#debug-tabs", "#debug-content", function(tab_index) {
                return tab_index ? "block" : "flex";
            });

            //运行信息标签位置初始化
            initTabSwitch("side_tab_index", "#debug-side-tabs", "#debug-side-content", function(tab_index) {
                return "block";
            });

            //调试器窗口大小初始化
            if (config.maximize) {
                $debug_modal.css("height", "100%");
                $("#debug-ctl-size").html("&or;").attr("title", "收起");
                $("html").css("overflow", "hidden");
            }

            //调试器显示状态初始化=
            if (config.show) {
                $debug_modal.css("display", "block");
                $("#debug-ctl-show").html("●").attr("title", "取消固定");
            }

            //监听打开按钮
            $("#debug-ctl-open").click(function () {
                $debug_modal.css("display", "block");
                if (config.maximize) {
                    $("html").css("overflow", "hidden");
                }
            });

            //监听关闭按钮
            $("#debug-ctl-close").click(function () {
                $debug_modal.css("display", "none");
                if (config.maximize) {
                    $("html").css("overflow", "auto");
                }
            });

            //监听固定显示按钮
            $("#debug-ctl-show").click(function () {
                if ($(this).text() == "○") {
                    $(this).html("●").attr("title", "取消固定");
                    config.show = true;
                } else {
                    $(this).html("○").attr("title", "固定");
                    config.show = false;
                }

                if (typeof localStorage !== "undefined") {
                    localStorage.setItem("zbpdk_debugger", JSON.stringify(config));
                }
            });

            //监听窗口大小调整按钮
            $("#debug-ctl-size").click(function () {
                if ($(this).text() == "∧") {
                    $debug_modal.css("height", "100%");
                    $(this).html("&or;").attr("title", "收起");
                    $("html").css("overflow", "hidden");
                    config.maximize = true;
                } else {
                    $debug_modal.css("height", "50%");
                    $(this).html("&and;").attr("title", "展开");
                    $("html").css("overflow", "auto");
                    config.maximize = false;
                }

                if (typeof localStorage !== "undefined") {
                    localStorage.setItem("zbpdk_debugger", JSON.stringify(config));
                }
            });

            /**
             * 标签位置切换
             *
             * @param {string} index_name 标签位置在配置中的属性名
             * @param {string} tab_selector 标签选择器
             * @param {string} content_selector 标签对应内容元素选择器
             * @param {function} display_style 内容元素display样式
             */
            var tabSwitch = function(index_name, tab_selector, content_selector, display_style) {
                $(tab_selector + ">li").click(function () {
                    var index = $(this).index();
                    $(this).siblings("li").removeClass("debug-tab-on");
                    $(this).addClass("debug-tab-on");
                    $(content_selector).children("li").hide();
                    $(content_selector + ">li:eq(" + index + ")").css("display", display_style(index));
                    config[index_name] = index;
                    if (typeof localStorage !== "undefined") {
                        localStorage.setItem("zbpdk_debugger", JSON.stringify(config));
                    }
                });
            };


            //监听主标签切换
            tabSwitch("tab_index", "#debug-tabs", "#debug-content", function(tab_index) {
                return tab_index ? "block" : "flex";
            });

            //监听运行信息标签切换
            tabSwitch("side_tab_index", "#debug-side-tabs", "#debug-side-content", function(tab_index) {
                return "block";
            });

            //监听系统变量的主变量切换
            $("#debug-main-var").on("change", function() {
                if (!$(this).val()) return;
                $.get(window.bloghost + "zb_users/plugin/ZBPDK/extensions/Debugger/api.php?action=get_subvar&main_var=" + $(this).val(), function(res) {
                    //移除现有的option并添加变量自身选项
                    $("#debug-sub-var")
                        .find("option")
                        .remove()
                        .end()
                        .append(new Option("变量自身", "0"));
                    //添加属性/键值
                    res[1].forEach(function(sub_var) {
                        $("#debug-sub-var").append(new Option(sub_var, sub_var));
                    });
                });
            });

            //查看变量
            $("#debug-var-submit").click(function() {
                var main_var = $("#debug-main-var").val(),
                    sub_var = $("#debug-sub-var").val();
                if (!main_var) return;
                $.get(window.bloghost + "zb_users/plugin/ZBPDK/extensions/Debugger/api.php?action=var_content&main_var=" + main_var + "&sub_var=" + sub_var, function(res) {
                    $("#debug-var-view").html(res[1]);
                });
            });
        }

        //获取接口详情
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