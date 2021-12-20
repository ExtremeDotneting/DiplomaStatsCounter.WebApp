import TestsApi from "../libs/testsApi/testsApi";
import ApiClient from "../src/js/apiClient"

TestsApi.registerTest("RepoStats_setCachedMyReposUseInTeaching", async function () {
    var arr = ["https://github.com/ExtremeDotneting/Avalonia",
        "https://github.com/ExtremeDotneting/ChatSpammers",
        "https://github.com/ExtremeDotneting/CinemaAdmin",
        "https://github.com/ExtremeDotneting/ComradeNetwork",
        "https://github.com/ExtremeDotneting/DiplomaStatsCounter.WebApp",
        "https://github.com/ExtremeDotneting/IROFramework",
        "https://github.com/ExtremeDotneting/sakura",
        "https://github.com/ExtremeDotneting/UndergroundIRO.TradingViewKit",
        "https://github.com/IT-rolling-out/IRO",
        "https://github.com/IT-rolling-out/IRO.Mvc",
        "https://github.com/IT-rolling-out/Telegram.Bot.AspNetPipeline",
        "https://github.com/egametang/ET",
        "https://github.com/TheAlgorithms/C-Sharp",
        "https://github.com/shadowsocks/shadowsocks-windows",
        "https://github.com/GavinYellow/SharpSCADA",
        "https://github.com/Unity-Technologies/UnityCsReference",
        "https://github.com/PlummersSoftwareLLC/Primes",
        "https://github.com/Auburn/FastNoiseLite",
        "https://github.com/statianzo/Fleck",
        "https://github.com/Ryujinx/Ryujinx",
        "https://github.com/ArduPilot/MissionPlanner",
        "https://github.com/dynamicexpresso/DynamicExpresso",
        "https://github.com/csinn/CSharp-From-Zero-To-Hero",
        "https://github.com/JumpAttacker/EnsageSharp",
        "https://github.com/microsoft/FASTER",
        "https://github.com/ServiceStack/ServiceStack.Redis",
        "https://github.com/enyim/EnyimMemcached",
        "https://github.com/EasyHttp/EasyHttp",
        "https://github.com/QuantConnect/Lean",
        "https://github.com/DragonBones/DragonBonesCSharp",
        "https://github.com/icsharpcode/NRefactory",
        "https://github.com/jacksondunstan/UnityNativeScripting",
        "https://github.com/pfusik/cito",
        "https://github.com/ferventdesert/Hawk",
        "https://github.com/matterpreter/OffensiveCSharp"];
    for (var i in arr) {
        var url=arr[i];
        var repo = await ApiClient.github_getRepositoryByUrl(url);
        await ApiClient.github_setUseInTeaching(repo.id, true);
    }
});
