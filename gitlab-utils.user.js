// ==UserScript==
// @name         Gitlab useful addons
// @namespace    http://gitlab.ccrowd.in/
// @version      0.0.11
// @description  some useful things for gitlab
// @author       Ilya Gulya
// @match        https://git.i20.biz/*
// @grant        none
// @downloadURL  https://rawgit.com/IlyaGulya/gitlab-utils-userscript/master/gitlab-utils.user.js
// @updateURL    https://rawgit.com/IlyaGulya/gitlab-utils-userscript/master/gitlab-utils.meta.js
// ==/UserScript==

function join(arr, char) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
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

function collectMRTitlesFromCommitMessages() {
    const titleField = $("#merge_request_title");
    const titles = $("a.commit-row-message.item-title").map((n, item) => {
        return $(item).text()
            .split("\n")
            .filter(str => str.length > 0)[0];
    });
    titles.splice(0, 0, "Append title from commit");
    const select = $(`<select id="append_title_from_last_commit">${join(titles.map((i, str) => `<option>${str}</option>`), "")}</select>`);
    select.insertAfter(titleField);
    select.change(() => {
        const title = select.val();
        if (title != "Append title from commit") {
            titleField.val(select.val());
        }
    });
}

function replaceTaskIdsWithLinks() {
    const allTitles = Array.from(document.querySelectorAll(".merge-request h2.title"));
    allTitles
        .map(node => {
            const match = node.innerText.match(/\[#(\d+)\]/);
            return {
                node: node,
                match: match
            };
        })
        .filter(data => data.match.length >= 2)
        .map(data => {
            return Object.assign({}, data, {
                matchFull: data.match[0],
                matchDigits: data.match[1]
            });
        })
        .forEach(data => {
            const link = $(`<a href="https://pm.i20.biz/issues/${data.matchDigits}">${data.matchFull}</a>`);
            const titleText = data.node.innerText.replace(data.matchFull, "");
            const titleTextElement = $(`<span>${titleText}</span>`);
            data.node.innerText = "";
            link.appendTo(data.node);
            titleTextElement.appendTo(data.node);
        })
}

$(function () {
    'use strict';
    collectMRTitlesFromCommitMessages();
    replaceTaskIdsWithLinks();
});
