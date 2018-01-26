// ==UserScript==
// @name         Gitlab useful addons
// @namespace    http://gitlab.ccrowd.in/
// @version      0.0.5
// @description  some useful things for gitlab
// @author       Ilya Gulya
// @match        https://git.i20.biz/*
// @grant        none
// ==/UserScript==

function join(arr, char) {
    var str = "";
    for (var i = 0; i< arr.length; i++) {
        str += arr[i];
        if (i > 0 && i < arr.length - 1) {
            str += char;
        }
    }
    return str;
}

function addFromAnnotations(titles) {
    var prev;
    for (var i in titles) {
        var current = titles[i];
        if (prev === undefined) {
            prev = current;
        }
    }
}

$(function() {
    'use strict';
    var titleField = $("#merge_request_title");
    var titles = $("a.commit-row-message.item-title").map((n, item) => {
        return $(item).text()
                      .split("\n")
                      .filter(str => str.length > 0)[0];
    });
    titles.splice(0,0, "Append title from commit");
    var select = $(`<select id="append_title_from_last_commit">${join(titles.map((i, str) => `<option>${str}</option>`), "")}</select>`);
    select.insertAfter(titleField);
    select.change(() => {
        var title = select.val();
        if (title != "Append title from commit") {
          titleField.val(select.val());
        }
    });
});
