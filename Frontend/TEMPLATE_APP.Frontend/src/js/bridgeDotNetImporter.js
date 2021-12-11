let Bridge = window["Bridge"];
let TabletopHelperSite = window["TabletopHelperSite"];


let BridgeMain = {
    CharlistModel() {
        return new TabletopHelperSite.BridgeDotNet.Models.CharlistModels.Charlist();
    },

    RollDiceFormula(formula) {
        return TabletopHelperSite.BridgeDotNet.DiceHelpers.DiceFormula.Roll(formula);
    }
}
export {
    Bridge,
    TabletopHelperSite,
    BridgeMain
}



