import { Exception } from "./exceptionProcessing/exceptions";
import Helpers from "./helpers";

class VueHelpersClass {
    routes = {}

    registerAllRoutes(routes) {
        for (var i = 0; i < routes.length; i++) {
            var r = routes[i];
            this.routes[r.path] = r;
        }
    }

    getVueComponentByRoute(pathname = window.location.pathname) {
        var comp = this.routes[pathname].component;
        return comp.AsType("object");
    }

    addComponentToRoutes(routes, component) {
        try {
            var url = "/comp/";
            if (component.__file) {
                if (component.__file.startsWith("src/pages")) {
                    url = "/";
                }
            }
            var compName = this.getComponentName(component);
            compName = compName[0].toLowerCase() + compName.substr(1);

            url = url + compName;

            routes.push({
                path: url,
                component: component,
                props: true
            })
        } catch (ex) {
            console.error(ex);
        }
    }

    getComponentName(component) {
        if (component.name)
            return component.name;
        else if (component.__file) {
            var fileName = Helpers.getFileName(component.__file);
            return fileName;
        }
        else {
            throw new Exception("Can't resolve component name of component:", component);
        }
    }
}

let VueHelpers = new VueHelpersClass();

export default VueHelpers;