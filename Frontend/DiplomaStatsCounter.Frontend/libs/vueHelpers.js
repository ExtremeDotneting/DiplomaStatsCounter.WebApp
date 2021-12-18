import { Exception } from "./exceptionProcessing/exceptions";
import Helpers from "./helpers";

class VueHelpersClass {
    routesByPath = {}
    routesByComponentName = {}
    routes = []

    registerAllRoutes(routes) {
        for (var i = 0; i < routes.length; i++) {
            var r = routes[i];
            r.componentName = this.getComponentName(r.component);
            r.path = "/" + r.path.split("/")[1];
            this.routesByPath[r.path] = r;
            this.routesByComponentName[r.componentName] = r;
        }
        this.routes = routes;
    }

    getAllComponentsInfo() {
        return this.routes;
    }

    getVueComponentInfoByRoute(index = 0, pathname = window.location.pathname) {
        try {
            pathname = "/" + pathname.split("/")[index + 1];
        }
        catch (ex) {
            return null;
        }
        var comp = this.routesByPath[pathname];
        if (!comp)
            console.warn("Can't find component of route " + pathname);
        return comp;
    }

    getVueComponentInfoByComponent(component) {
        var name = this.getComponentName(component);
        return this.getVueComponentInfoByName(name);
    }

    getVueComponentInfoByName(name) {
        var comp = this.routesByComponentName[name];
        if (!comp)
            console.warn("Can't find component with name " + name);
        return comp;
    }

    addComponentToRoutes(routes, component, isChild) {
        try {
            var prefix = isChild ? "" : "/";

            var url = prefix + "comp_";
            if (component.__file) {
                if (component.__file.startsWith("src/pages")) {
                    url = prefix;
                }
            }
            var compName = this.getComponentName(component);
            compName = compName[0].toLowerCase() + compName.substr(1);

            url = url + compName;

            var newRoute = {
                path: url,
                component: component,
                props: true
            };

            if (component.childRoutes) {
                //url = url + "/:nestedRoutes";
                var childRoutes = [];
                for (var i in component.childRoutes) {
                    this.addComponentToRoutes(childRoutes, component.childRoutes[i], true);
                }
                newRoute.children = childRoutes;
                newRoute.path = url;
            }

            routes.push(newRoute)
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

const VueHelpers = new VueHelpersClass();

export default VueHelpers;