import DialogForm from "@/components/DialogForm";
import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import router from '@/js/router';
import helpers from "./helpers";

var dialogs = {
    showDialog({
        title,
        text,
        toolbarVisible=true,
        //Pass here html element
        htmlElementContent,
        //Pass here created vue component
        createdComponentContent,
        //Pass here vue component
        typeOfComponentContent,
        dialogButtons,
        maxWidth,
        fullscreen
    }) {
        return this._showDialog(function (data) {
            data.fullscreen = !!fullscreen;
            data.toolbarVisible=toolbarVisible;
            data.title = title;
            data.dialogText = text;
            if (dialogButtons)
                data.dialogButtons = dialogButtons;
            if (maxWidth)
                data.maxWidth = maxWidth;
        }, createdComponentContent, typeOfComponentContent, htmlElementContent);
    },

    _showDialog(configureFunction, createdComponentContent, typeOfComponentContent, htmlElementContent) {
        var dataTemplate = DialogForm.data();
        dataTemplate.title = '';
        dataTemplate.dialogText = '';
        configureFunction(dataTemplate);

        var CompClass = Vue.extend(DialogForm);
        let dialog = new CompClass({
                vuetify,
                router,
                data: () => {
                    return dataTemplate;
                }
            })
            .$mount();

        var contentId = helpers.textGen(10);
        dataTemplate.contentRandomId = contentId;

        if (typeOfComponentContent) {
            dialog.$nextTick(function () {
                var InnerCompClass = Vue.extend(typeOfComponentContent);
                let innerContent = new InnerCompClass({
                        vuetify,
                        router
                    })
                    .$mount();
                document
                    .getElementById(contentId)
                    .appendChild(innerContent.$el);
            });
        }


        if (createdComponentContent) {
            if (typeof (createdComponentContent.$mount) !== "function") {
                throw "Exception: passed param must have 'mount' function, it seems param 'createdComponentContent' is not vue component.";
            }
            dialog.$nextTick(function () {
                let innerContent = createdComponentContent
                    .$mount();
                document
                    .getElementById(contentId)
                    .appendChild(innerContent.$el);
            });
        }
        
        if (htmlElementContent) {
            dialog.$nextTick(function () {
                document
                    .getElementById(contentId)
                    .appendChild(htmlElementContent);
            });
        }

        return dialog.closePromise;
    }
}
export default dialogs;