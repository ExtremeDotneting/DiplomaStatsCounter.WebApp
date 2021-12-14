import TestsApi from "../libs/testsApi/testsApi";
import dialogs from "../src/js/dialogs"
import SignInPage from '@/pages/SignInPage'
import Vue from 'vue'

TestsApi.registerTest("DialogTests_HtmlElementContent", async function () {
    let el = document.createElement("p");
    el.innerHTML = "HI!!!!!!!";
    await dialogs.showDialog({
        htmlElementContent: el,
        maxWidth: 600
    });
});

TestsApi.registerTest("DialogTests_CreatedComponentContent", async function () {
    let CompClass = Vue.extend(SignInPage);
    let instance = new CompClass( /* here can configure it */);
    await dialogs.showDialog({
        createdComponentContent: instance,
        maxWidth: 600
    });
});

TestsApi.registerTest("DialogTests_TypeOfComponentContent", async function () {
    await dialogs.showDialog({
        typeOfComponentContent: SignInPage,
        fullscreen: true
    });
});

TestsApi.registerTest("DialogTests_AwaitTest", async function () {
    var index = 1;
    var promiseRes = await dialogs.showDialog({
        title: "Form 1",
        text: "Form text 1",
        maxWidth: 1000
    });
    console.log("Form #" + index + ":\n" + promiseRes);
    index++;

    promiseRes = await dialogs.showDialog({
        title: "Form 2",
        text: "Form text 2",
        fullscreen: true
    });
    console.log("Form #" + index + ":\n" + promiseRes);
    index++;

    promiseRes = await dialogs.showDialog({
        title: "Form 3",
        maxWidth: 500
    });
    console.log("Form #" + index + ":\n" + promiseRes);
    index++;

});

TestsApi.registerTest("DialogTests_FS", async function () {
    var index = 1;
    var promiseRes = await dialogs.showDialog({
        title: "Fullscreen form",
        text: "Form text",
        fullscreen: true
    });
    console.log("Form #" + index + ":\n" + promiseRes);
});

TestsApi.registerTest("DialogTests_NotFS", async function () {
    var index = 1;
    var promiseRes = await dialogs.showDialog({
        title: "1000px width form",
        maxWidth: 1000
    });
    console.log("Form #" + index + ":\n" + promiseRes);

});

TestsApi.registerTest("DialogTests_Multiple", function () {
    dialogs.showDialog({
        title: "Form 1",
        text: "Open many forms.",
        maxWidth: 1000
    });
    dialogs.showDialog({
        title: "Form 2",
        text: "Open many forms.",
        maxWidth: 800
    });
    dialogs.showDialog({
        title: "Form 3",
        text: "Open many forms.",
        maxWidth: 600
    });
    dialogs.showDialog({
        title: "Form 4",
        text: "Open many forms.",
        maxWidth: 500
    });
    dialogs.showDialog({
        title: "Form 5",
        text: "Open many forms.",
        maxWidth: 400
    });

});

