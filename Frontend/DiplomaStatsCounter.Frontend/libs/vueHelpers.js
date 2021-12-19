import { Exception } from "./exceptionProcessing/exceptions";
import Helpers from "./helpers";

class VueHelpersClass {
    routesByPath = {}
    routesByComponentName = {}
    routes = []

    registerAllRoutes(routes) {
        var _this = this;
        function addRoute(route, byComponentToo) {
            if (byComponentToo)
                _this.routesByComponentName[route.componentName] = route;
            _this.routesByPath[route.path] = route;
            _this.routes.push(route);
        }
        function registerRoutes(prefix, innerRoutes) {
            if (!innerRoutes)
                return;
            for (var i in innerRoutes) {
                var route = innerRoutes[i];
                //Clonning
                route = {
                    component: route.component,
                    path: route.path,
                    children: route.children
                };
                route.componentName = _this.getComponentName(route.component);
                var currentPrefix = route.path[0] === "/" ? prefix : prefix + "/";
                route.path = currentPrefix + route.path;
                addRoute(route, prefix === "");
                registerRoutes(route.path, route.children);
            }
        }

        registerRoutes("", routes);
    }

    getAllComponentsInfo() {
        return this.routes;
    }

    getVueComponentInfoByRoute(index = 0, pathname = window.location.pathname) {
        try {
            pathname = "/" + pathname.split("/")[index + 1];
            pathname = pathname.split("?")[0];
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
                //newRoute.path = url;
                var childRoutes = [];
                for (var i in component.childRoutes) {
                    this.addComponentToRoutes(childRoutes, component.childRoutes[i], true);
                }
                newRoute.children = childRoutes;
            }

            routes.push(newRoute);
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